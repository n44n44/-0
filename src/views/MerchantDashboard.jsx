import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Store,
  Tag,
  Package,
  ShoppingBag,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  ArrowUpRight,
  DollarSign,
  Calculator,
  Percent,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Globe,
  Share2,
  Filter,
  ChevronDown,
  ArrowRight,
  Upload,
  AlertCircle,
  Check,
  ShieldCheck,
  Headphones,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  RefreshCw,
  Wallet,
  ArrowDownLeft,
  Crown
} from 'lucide-react';
import { usePlatform, calculateDaysRemaining } from '../context/PlatformContext';
import { LOGO_DATA_URI } from '../data/logoBase64';
import YemeniPhoneInput from '../components/YemeniPhoneInput';
import MerchantPaymentModal from '../components/MerchantPaymentModal';

export default function MerchantDashboard({ onBackToMarket }) {
  const {
    categories = [],
    merchantsList = [],
    activeMerchantId,
    currentMerchantUser,
    switchMerchantAccount,
    merchantProducts = [],
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock,
    merchantOrders = [],
    markOrderReadyForPickup,
    merchantStore,
    updateMerchantStore,
    merchantSubscription,
    merchantInvoices = [],
    merchantPayments = [],
    notifications = [],
    markAllNotificationsAsRead,
  } = usePlatform();

  // Navigation tab matching Stitch screens:
  // 'dashboard' (Screen 5) | 'store-profile' (Screens 1 & 3) | 'pricing' (Screen 2) |
  // 'products' (Screen 7) | 'add-product' (Screen 8) | 'orders' (Screen 4) |
  // 'sales' (Screen 6) | 'settings' | 'support'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Notifications dropdown
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Switch merchant modal / account selector
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Success toast notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ==========================================================================
     1. CALCULATOR STATE (Screen 2: التسعير وحاسبة الربح)
     ========================================================================== */
  const [calcCost, setCalcCost] = useState(15000);
  const [calcPackaging, setCalcPackaging] = useState(1500);
  const [calcProfitMargin, setCalcProfitMargin] = useState(25); // 25%
  const [calcDiscount, setCalcDiscount] = useState(0);

  const calcResults = useMemo(() => {
    const cost = Number(calcCost) || 0;
    const packaging = Number(calcPackaging) || 0;
    const margin = Number(calcProfitMargin) || 0;
    const discount = Number(calcDiscount) || 0;

    const baseCost = cost + packaging;
    const desiredProfit = baseCost * (margin / 100);
    // Platform commission is 2% of the selling price
    // finalPrice = (baseCost + desiredProfit) / (1 - 0.02)
    const rawPrice = baseCost + desiredProfit;
    const platformCommission = rawPrice * 0.02;
    const suggestedPrice = Math.round(rawPrice + platformCommission);
    const finalPrice = discount > 0 ? suggestedPrice - discount : suggestedPrice;
    const actualCommission = Math.round(finalPrice * 0.02);
    const netProfit = Math.round(finalPrice - baseCost - actualCommission);
    const actualMargin = finalPrice > 0 ? Math.round((netProfit / finalPrice) * 100) : 0;

    return {
      baseCost,
      desiredProfit: Math.round(desiredProfit),
      suggestedPrice,
      platformCommission: actualCommission,
      netProfit,
      actualMargin,
      finalPrice,
    };
  }, [calcCost, calcPackaging, calcProfitMargin, calcDiscount]);

  /* ==========================================================================
     2. STORE PROFILE STATE (Screens 1 & 3: معلومات المتجر & الحسابات البنكية)
     ========================================================================== */
  const [storeForm, setStoreForm] = useState({
    name: merchantStore?.name || 'متجر وردة الأناقة',
    ownerName: currentMerchantUser?.name || 'أحمد باقازي',
    phone: currentMerchantUser?.phone || '773058707',
    description: merchantStore?.description || 'متجر حضرمي متخصص في أجود أنواع البخور المكلاوي والعطور الشرقية الفاخرة والعود الطبيعي.',
    city: merchantStore?.city || 'المكلا',
    neighborhood: merchantStore?.neighborhood || 'حي الشهيد - الديس',
    email: currentMerchantUser?.email || 'warda.store@ghaym.space',
    website: 'https://ghaym.space/#/store/' + (merchantStore?.id || 'store-1'),
    socialX: '@warda_style',
    socialInstagram: '@warda_elegance',
    socialTikTok: '@warda_luxury',
    socialYouTube: '@warda_perfumes',
    isOpen: true,
    minOrderAmount: 3000,
    shippingPolicy: 'التوصيل متاح لكافة مناطق ساحل ووادي حضرموت خلال 24 إلى 48 ساعة بواسطة أسطول غيم سبيس السريع.',
    bankAccounts: [
      { id: 'b1', bank: 'بنك الكريمي للتمويل الأصغر', accountName: 'أحمد سعيد باقازي', accountNumber: '30129841', iban: 'YE30KRM000000030129841', isDefault: true },
      { id: 'b2', bank: 'شركة العمقي وإخوانه للصرافة', accountName: 'متجر وردة الأناقة', accountNumber: 'AMQ-889021', iban: 'YE88AMQ00000000889021', isDefault: false },
    ],
  });

  const [newBankModal, setNewBankModal] = useState(false);
  const [newBankData, setNewBankData] = useState({ bank: 'بنك الكريمي', accountName: '', accountNumber: '', iban: '' });

  const handleAddBankAccount = () => {
    if (!newBankData.accountNumber || !newBankData.accountName) {
      showToast('يرجى ملء اسم ورقم الحساب', 'error');
      return;
    }
    const newAcc = {
      id: 'b-' + Date.now(),
      bank: newBankData.bank,
      accountName: newBankData.accountName,
      accountNumber: newBankData.accountNumber,
      iban: newBankData.iban || ('YE-' + newBankData.accountNumber),
      isDefault: storeForm.bankAccounts.length === 0,
    };
    setStoreForm(prev => ({ ...prev, bankAccounts: [...prev.bankAccounts, newAcc] }));
    setNewBankData({ bank: 'بنك الكريمي', accountName: '', accountNumber: '', iban: '' });
    setNewBankModal(false);
    showToast('تمت إضافة الحساب البنكي بنجاح');
  };

  const handleDeleteBankAccount = (id) => {
    setStoreForm(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(b => b.id !== id),
    }));
    showToast('تم حذف الحساب البنكي');
  };

  const handleSaveStoreProfile = (e) => {
    if (e) e.preventDefault();
    updateMerchantStore({
      name: storeForm.name,
      description: storeForm.description,
      city: storeForm.city,
      neighborhood: storeForm.neighborhood,
      phone: storeForm.phone,
    });
    showToast('تم حفظ وتحديث بيانات المتجر بنجاح ✨');
  };

  /* ==========================================================================
     3. PRODUCTS STATE (Screen 7: المنتجات & Screen 8: إضافة منتج)
     ========================================================================== */
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [editingProductId, setEditingProductId] = useState(null);

  // New / Edit Product Form (Screen 8)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'عطور وبخور',
    subCategory: 'بخور مكلاوي فاخر',
    price: 18000,
    discountPrice: 15500,
    inStock: 25,
    barcode: '629110829012',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    ],
    isActive: true,
    isFeatured: true,
    sizes: [
      { id: 's1', size: 'صغير (50 جرام)', stock: 12, price: 9000, offerPrice: 8000, barcode: 'SKU-001-SM' },
      { id: 's2', size: 'وسط (100 جرام)', stock: 20, price: 16000, offerPrice: 14500, barcode: 'SKU-001-MD' },
      { id: 's3', size: 'كبير ملكي (250 جرام)', stock: 8, price: 32000, offerPrice: 29000, barcode: 'SKU-001-LG' },
    ],
  });

  const handleAddSizeRow = () => {
    setProductForm(prev => ({
      ...prev,
      sizes: [
        ...prev.sizes,
        { id: 's-' + Date.now(), size: 'حجم جديد', stock: 10, price: 10000, offerPrice: '', barcode: 'SKU-' + Math.floor(100 + Math.random() * 900) },
      ],
    }));
  };

  const handleRemoveSizeRow = (id) => {
    setProductForm(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s.id !== id),
    }));
  };

  const handleSaveProduct = (e) => {
    if (e) e.preventDefault();
    if (!productForm.name) {
      showToast('يرجى كتابة اسم المنتج', 'error');
      return;
    }

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
        inStock: Number(productForm.inStock),
        image: productForm.image,
      });
      showToast('تم تحديث بيانات المنتج بنجاح');
    } else {
      addProduct({
        name: productForm.name,
        description: productForm.description,
        category: productForm.category,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
        inStock: Number(productForm.inStock),
        image: productForm.image,
        sizes: productForm.sizes.map(s => s.size).join(', '),
      });
      showToast('تمت إضافة المنتج الجديد بنجاح إلى متجرك ✨');
    }

    setEditingProductId(null);
    setActiveTab('products');
  };

  const handleEditProductClick = (prod) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name || '',
      description: prod.description || '',
      category: prod.category || 'عطور وبخور',
      subCategory: 'منتجات فاخرة',
      price: prod.price || 15000,
      discountPrice: prod.discountPrice || '',
      inStock: prod.inStock || 10,
      barcode: prod.barcode || '62910029381',
      image: prod.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
      images: [prod.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'],
      isActive: true,
      isFeatured: true,
      sizes: [
        { id: 's1', size: 'العبوة القياسية', stock: prod.inStock || 10, price: prod.price || 15000, offerPrice: prod.discountPrice || '', barcode: 'SKU-STD' },
      ],
    });
    setActiveTab('add-product');
  };

  const handleDeleteProductClick = (id, name) => {
    if (window.confirm(`هل أنت متأكد من حذف المنتج "${name}"؟`)) {
      deleteProduct(id);
      showToast('تم حذف المنتج');
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return merchantProducts.filter(p => {
      const matchSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchStatus = productStatusFilter === 'all' || (productStatusFilter === 'active' ? p.inStock > 0 : p.inStock === 0);
      return matchSearch && matchCat && matchStatus;
    });
  }, [merchantProducts, productSearch, productCategoryFilter, productStatusFilter]);

  /* ==========================================================================
     4. ORDERS STATE (Screen 4: الطلبات)
     ========================================================================== */
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    return merchantOrders.filter(o => {
      const matchSearch = !orderSearch ||
        o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.customer && o.customer.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [merchantOrders, orderSearch, orderStatusFilter]);

  const orderStats = useMemo(() => {
    const total = merchantOrders.length;
    const completed = merchantOrders.filter(o => o.status === 'delivered' || o.status === 'مكتمل').length;
    const shipping = merchantOrders.filter(o => o.status === 'delivering' || o.status === 'قيد الشحن' || o.status === 'ready_for_pickup').length;
    const processing = merchantOrders.filter(o => o.status === 'processing' || o.status === 'قيد المعالجة' || o.status === 'placed').length;
    return { total, completed, shipping, processing };
  }, [merchantOrders]);

  /* ==========================================================================
     5. SALES & STATS (Screen 6: المبيعات والتقارير & Screen 5: الرئيسية)
     ========================================================================== */
  const [salesPeriod, setSalesPeriod] = useState('30days');

  const stats = useMemo(() => {
    const totalSales = merchantOrders.reduce((sum, o) => sum + (Number(o.total) || Number(o.amount) || 0), 0) || 48950;
    const totalOrdersCount = merchantOrders.length || 248;
    const platformCommission = Math.round(totalSales * 0.02);
    const merchantNetEarnings = totalSales - platformCommission;
    const activeProdsCount = merchantProducts.filter(p => p.inStock > 0).length || 8;
    return {
      totalSales,
      totalOrdersCount,
      platformCommission,
      merchantNetEarnings,
      activeProdsCount,
      growthRate: 18,
      ordersGrowth: 12,
      rating: 4.9,
    };
  }, [merchantOrders, merchantProducts]);

  // Payment Modal state for subscription
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div className="min-h-screen bg-[#f3f7fb] text-slate-800 font-['Cairo',sans-serif] flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* ==========================================================================
          SIDEBAR NAVIGATION (Matching Stitch: Dark Navy Gradient with Blue Glow)
          ========================================================================== */}
      <aside className="w-full md:w-72 bg-gradient-to-b from-[#0e213d] via-[#102747] to-[#0a172c] text-white flex-shrink-0 flex flex-col justify-between shadow-2xl z-30 border-l border-blue-900/40">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-blue-900/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 backdrop-blur-md border border-white/20 shadow-[0_0_20px_rgba(29,117,242,0.4)] flex items-center justify-center transition-transform group-hover:scale-105">
                  <img src={LOGO_DATA_URI} alt="غيم سبيس" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0e213d]" title="المتجر متصل ومباشر"></div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-wide">منصتي</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">التاجر</span>
                </div>
                <p className="text-xs text-blue-200/60 truncate max-w-[130px]">{merchantStore?.name || 'متجر وردة الأناقة'}</p>
              </div>
            </div>

            {/* Back to market link */}
            <button
              onClick={onBackToMarket}
              title="العودة إلى متجر غيم سبيس الرئيسي"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-blue-200 transition-colors border border-white/10"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Current Merchant Pill / Store Switcher */}
          <div className="px-5 pt-5 pb-2">
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="w-full p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 transition-all flex items-center justify-between text-right group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                    {merchantStore?.name ? merchantStore.name.charAt(0) : 'م'}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-blue-300">المتجر الحالي</div>
                    <div className="text-sm font-bold text-white truncate max-w-[120px]">{merchantStore?.name || 'متجر وردة الأناقة'}</div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-blue-300 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Account Dropdown */}
              {isAccountMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#12233f] border border-blue-500/20 rounded-2xl p-2 shadow-2xl z-50 backdrop-blur-xl">
                  <div className="text-[11px] font-semibold text-blue-300/80 px-2.5 py-1.5">تبديل حساب التاجر:</div>
                  {merchantsList.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        switchMerchantAccount(m.id);
                        setIsAccountMenuOpen(false);
                        showToast(`تم التبديل إلى متجر ${m.name}`);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${activeMerchantId === m.id ? 'bg-blue-600 text-white font-bold' : 'hover:bg-white/5 text-slate-300'}`}
                    >
                      <span className="truncate">{m.name}</span>
                      {activeMerchantId === m.id && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links (Matching Stitch order & icons) */}
          <nav className="p-4 space-y-1.5">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
              { id: 'store-profile', label: 'معلومات المتجر', icon: Store },
              { id: 'pricing', label: 'التسعير وحاسبة الربح', icon: Calculator },
              { id: 'products', label: 'المنتجات', icon: Package },
              { id: 'orders', label: 'الطلبات', icon: ShoppingBag, badge: merchantOrders.length },
              { id: 'sales', label: 'المبيعات والتقارير', icon: TrendingUp },
              { id: 'settings', label: 'الإعدادات', icon: Settings },
              { id: 'support', label: 'الدعم والمساعدة', icon: Headphones },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'products' && activeTab === 'add-product');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'products' && activeTab === 'add-product') {
                      setEditingProductId(null);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.4)] translate-x-1'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-blue-600' : 'bg-blue-500/20 text-blue-300'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Logout / Store status */}
        <div className="p-4 border-t border-blue-900/40">
          <button
            onClick={onBackToMarket}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-slate-300 hover:text-red-300 transition-all text-sm font-bold border border-white/5"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج والعودة للمنصة</span>
          </button>
        </div>
      </aside>

      {/* ==========================================================================
          MAIN CONTENT AREA
          ========================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-[#f8fafc] via-[#edf4fc] to-[#e4eef9] overflow-y-auto min-h-screen">
        
        {/* TOP BAR / HEADER */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-blue-100/60 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'لوحة تحكم التاجر - الرئيسية'}
              {activeTab === 'store-profile' && 'إدارة وتحديث معلومات المتجر'}
              {activeTab === 'pricing' && 'التسعير الذكي وحاسبة الأرباح'}
              {activeTab === 'products' && 'إدارة المنتجات والمخزون'}
              {activeTab === 'add-product' && (editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد')}
              {activeTab === 'orders' && 'سجل وطلبات العملاء'}
              {activeTab === 'sales' && 'المبيعات والتقارير المالية'}
              {activeTab === 'settings' && 'إعدادات المتجر والحساب'}
              {activeTab === 'support' && 'مركز المساعدة والدعم المباشر'}
            </h1>
            <span className="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-200">
              حضرموت - المكلا
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action: Add Product */}
            {activeTab !== 'add-product' && (
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setActiveTab('add-product');
                }}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج</span>
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 relative transition-colors shadow-sm"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                    <span className="font-bold text-xs text-slate-800">التنبيهات ({notifications.length})</span>
                    <button onClick={markAllNotificationsAsRead} className="text-[11px] text-blue-600 hover:underline">
                      تعليم كمقروء
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 py-1">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-400">لا توجد تنبيهات جديدة</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="p-2.5 hover:bg-blue-50/50 rounded-xl transition-colors text-right">
                          <p className="text-xs font-semibold text-slate-800">{n.title || n.message}</p>
                          <span className="text-[10px] text-slate-400">{n.time || 'الآن'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Merchant User Pill */}
            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                {currentMerchantUser?.name ? currentMerchantUser.name.charAt(0) : 'ت'}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-slate-800">{currentMerchantUser?.name || 'أحمد التاجر'}</div>
                <div className="text-[10px] text-slate-400">تاجر معتمد</div>
              </div>
            </div>
          </div>
        </header>

        {/* TOAST MESSAGE POPUP */}
        {toast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className={`px-5 py-3 rounded-2xl shadow-2xl text-white text-xs font-bold flex items-center gap-3 backdrop-blur-md animate-bounce ${
              toast.type === 'error' ? 'bg-red-600/90' : 'bg-blue-600/95'
            }`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* TAB CONTENTS */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

          {/* ==================================================================
              TAB 1: DASHBOARD (Screen 5: لوحة تحكم التاجر / الرئيسية)
              ================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Welcome Hero Banner (Matching Stitch Blue Gradient + Illustration) */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173d6e] via-[#1d5aa0] to-[#2563eb] text-white p-8 md:p-10 shadow-xl border border-blue-400/20">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>مرحباً بك في منصتك السحابية الذكية</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-3 leading-snug">
                    أهلاً بك مجدداً، {currentMerchantUser?.name || 'أحمد التاجر'} 👋
                  </h2>
                  <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-6 font-medium">
                    لوحة تحكم متجرك متصلة بالكامل ومحدثة آنياً مع قاعدة بيانات غيم سبيس. تابع أداء مبيعاتك، المنتجات، والطلبات بكل احترافية وسلاسة.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('add-product')}
                      className="px-5 py-2.5 rounded-xl bg-white text-blue-900 font-black text-xs shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>إضافة منتج جديد</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4 text-amber-300" />
                      <span>حاسبة التسعير والربح</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4 text-blue-200" />
                      <span>متابعة الطلبات</span>
                    </button>
                  </div>
                </div>

                {/* Decorative background glow */}
                <div className="absolute -left-12 -bottom-12 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute right-1/2 -top-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
              </div>

              {/* 4 Stats Cards (Screen 5 Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* Total Sales */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+{stats.growthRate}%</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">
                    {stats.totalSales.toLocaleString()} <span className="text-xs font-normal text-slate-500">ريال</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">إجمالي المبيعات المحققة</p>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>+{stats.ordersGrowth}%</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">
                    {stats.totalOrdersCount} <span className="text-xs font-normal text-slate-500">طلب</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">الطلبات الكلية المنجزة</p>
                </div>

                {/* Active Products */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                      نشط في المتجر
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">
                    {merchantProducts.length} <span className="text-xs font-normal text-slate-500">منتج</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">المنتجات المعروضة للزبائن</p>
                </div>

                {/* Platform Commission 2% */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Percent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                      ثابتة ومخفضة
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-600 mb-1">
                    2% <span className="text-xs font-normal text-slate-500">فقط</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">عمولة منصة غيم سبيس</p>
                </div>

              </div>

              {/* Subscription & Platform Support Section (Screen 5) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Subscription Card */}
                <div className="bg-gradient-to-br from-white to-blue-50/60 rounded-3xl p-6 border border-blue-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">باقة التاجر الفضي</h3>
                          <span className="text-[11px] text-slate-500">سارية حتى 31 ديسمبر 2026</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                        مفعّلة
                      </span>
                    </div>

                    <div className="my-4 p-4 rounded-2xl bg-white border border-blue-100/80">
                      <div className="text-xs text-slate-500 mb-1">رسوم الاشتراك الشهري</div>
                      <div className="text-2xl font-black text-blue-600">6,000 <span className="text-xs text-slate-500 font-normal">ريال / شهرياً</span></div>
                    </div>

                    <ul className="text-xs text-slate-600 space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>منتجات غير محدودة في المتجر</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>ربط مع أسطول مناديب غيم سبيس</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>عمولة 2% مخفضة على الطلبات الناجحة</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>تجديد أو ترقية الباقة</span>
                  </button>
                </div>

                {/* Recent Orders Overview */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-slate-900 text-base">أحدث طلبات المتجر</h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <span>عرض الكل</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-100">
                            <th className="pb-3 font-semibold">رقم الطلب</th>
                            <th className="pb-3 font-semibold">العميل</th>
                            <th className="pb-3 font-semibold">المبلغ</th>
                            <th className="pb-3 font-semibold">الحالة</th>
                            <th className="pb-3 font-semibold">التاريخ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {merchantOrders.slice(0, 4).map((order, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-3 font-bold text-blue-600">{order.id}</td>
                              <td className="py-3 font-medium text-slate-800">{order.customer || 'عميل غيم'}</td>
                              <td className="py-3 font-bold text-slate-900">{order.total || order.amount || 18500} ريال</td>
                              <td className="py-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  order.status === 'delivered' || order.status === 'مكتمل'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : order.status === 'ready_for_pickup' || order.status === 'delivering'
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {order.status === 'delivered' ? 'مكتمل' : order.status === 'ready_for_pickup' ? 'جاهز للتوصيل' : 'قيد المعالجة'}
                                </span>
                              </td>
                              <td className="py-3 text-slate-400">{order.date || 'اليوم'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>إجمالي الطلبات في السجل: {merchantOrders.length}</span>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      إدارة ومعالجة الطلبات ←
                    </button>
                  </div>
                </div>

              </div>

              {/* 3 Pillars Footer Cards (Screen 5 Layout) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">نمو مستمر للمبيعات</h4>
                    <p className="text-xs text-slate-500">وصول مباشر لآلاف العملاء في المكلا وحضرموت</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">دعم فني متميز 24/7</h4>
                    <p className="text-xs text-slate-500">فريق غيم سبيس جاهز لمساعدتك عبر الهاتف 773058707</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">أمان وموثوقية في الدفع</h4>
                    <p className="text-xs text-slate-500">تسوية سريعة للأرباح عبر الكريمي والعمقي</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================================
              TAB 2: STORE PROFILE (Screens 1 & 3: إدارة معلومات المتجر)
              ================================================================== */}
          {activeTab === 'store-profile' && (
            <div className="space-y-8">
              
              <form onSubmit={handleSaveStoreProfile} className="space-y-8">
                
                {/* Store Header & Cover Preview */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                    <div>
                      <h2 className="text-lg font-black text-slate-900">هوية المتجر والشعار</h2>
                      <p className="text-xs text-slate-500">قم بتخصيص شعار متجرك وصورة الغلاف لجذب المزيد من الزبائن</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-200">
                      متجر نشط ومعتمد
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Logo upload mockup */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-28 h-28 rounded-3xl bg-slate-100 border-2 border-dashed border-blue-400 p-2 relative flex items-center justify-center shadow-md">
                        <img
                          src={merchantStore?.image || merchantStore?.logo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                          alt="شعار المتجر"
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('يمكنك رفع شعار جديد من خلال إعدادات الوسائط')}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>تغيير الشعار</span>
                      </button>
                    </div>

                    {/* Store quick info */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="text-xl font-black text-slate-900">{storeForm.name}</div>
                      <p className="text-xs text-slate-600 leading-relaxed">{storeForm.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                          📍 {storeForm.city} - {storeForm.neighborhood}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold">
                          📞 {storeForm.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Store Information */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">
                    البيانات الأساسية للمتجر
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">اسم المتجر *</label>
                      <input
                        type="text"
                        value={storeForm.name}
                        onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">اسم المالك / التاجر المسؤول *</label>
                      <input
                        type="text"
                        value={storeForm.ownerName}
                        onChange={(e) => setStoreForm({ ...storeForm, ownerName: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">رقم الجوال (واتساب للتواصل) *</label>
                      <input
                        type="text"
                        value={storeForm.phone}
                        onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold text-left font-mono"
                        dir="ltr"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">البريد الإلكتروني الرسمي</label>
                      <input
                        type="email"
                        value={storeForm.email}
                        onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold text-left font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">المدينة</label>
                      <select
                        value={storeForm.city}
                        onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold bg-white"
                      >
                        <option value="المكلا">المكلا</option>
                        <option value="الشحر">الشحر</option>
                        <option value="سيئون">سيئون</option>
                        <option value="تريم">تريم</option>
                        <option value="عدن">عدن</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">الحي / الشارع التفصيلي</label>
                      <input
                        type="text"
                        value={storeForm.neighborhood}
                        onChange={(e) => setStoreForm({ ...storeForm, neighborhood: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-2">وصف ونبذة عن المتجر</label>
                      <textarea
                        rows={3}
                        value={storeForm.description}
                        onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-medium leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">
                    حسابات التواصل الاجتماعي للمتجر
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">إنستغرام Instagram</label>
                      <input
                        type="text"
                        value={storeForm.socialInstagram}
                        onChange={(e) => setStoreForm({ ...storeForm, socialInstagram: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-left font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">تيك توك TikTok</label>
                      <input
                        type="text"
                        value={storeForm.socialTikTok}
                        onChange={(e) => setStoreForm({ ...storeForm, socialTikTok: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-left font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">منصة X (تويتر سابقاً)</label>
                      <input
                        type="text"
                        value={storeForm.socialX}
                        onChange={(e) => setStoreForm({ ...storeForm, socialX: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-left font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">يوتيوب YouTube</label>
                      <input
                        type="text"
                        value={storeForm.socialYouTube}
                        onChange={(e) => setStoreForm({ ...storeForm, socialYouTube: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-left font-mono"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Accounts Section (Screen 3 Layout) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900">الحسابات البنكية لاستلام الأرباح</h3>
                      <p className="text-xs text-slate-500">يتم تحويل أرباحك الأسبوعية والشهرية مباشرة إلى هذه الحسابات المعتمدة</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewBankModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة حساب بنكي</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {storeForm.bankAccounts.map((acc) => (
                      <div key={acc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{acc.bank}</span>
                              {acc.isDefault && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                                  الحساب الأساسي
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 font-mono">
                              الاسم: <span className="font-semibold text-slate-700 font-sans">{acc.accountName}</span> | الحساب: <span className="font-bold text-slate-900">{acc.accountNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteBankAccount(acc.id)}
                            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                            title="حذف الحساب"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl shadow-blue-500/20 transition-transform hover:scale-[1.02] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>حفظ كافة التغييرات</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ==================================================================
              TAB 3: PRICING & PROFIT CALCULATOR (Screen 2: التسعير وحاسبة الربح)
              ================================================================== */}
          {activeTab === 'pricing' && (
            <div className="space-y-8">
              
              {/* Header Card with 3D Calculator Style */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0d223f] via-[#15345d] to-[#1e40af] text-white p-8 md:p-10 shadow-xl border border-blue-400/20">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-3">
                    <Calculator className="w-3.5 h-3.5 text-amber-300" />
                    <span>أداة التسعير الذكي وحاسبة هامش الربح</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black mb-3 leading-snug">
                    احسب تسعيرة منتجاتك وصافي ربحك بدقة متناهية
                  </h2>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    حدد تكاليف المواد والتغليف ونسبة ربحك المطلوبة، وستقوم الحاسبة تلقائياً باحتساب سعر البيع النهائي للزبون مع احتساب عمولة غيم سبيس المخفضة (2% فقط).
                  </p>
                </div>
              </div>

              {/* Calculator Inputs and Outputs Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Inputs Column */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    <span>مدخلات التكلفة والربح</span>
                  </h3>

                  <div className="space-y-5">
                    
                    {/* Cost of product */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>تكلفة إنتاج / شراء المنتج الأساسية (ريال يمني)</span>
                        <span className="text-blue-600 font-black">{Number(calcCost).toLocaleString()} ريال</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={calcCost}
                        onChange={(e) => setCalcCost(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold text-slate-800"
                      />
                    </div>

                    {/* Cost of packaging */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>تكلفة التغليف والعلب والملصقات (ريال يمني)</span>
                        <span className="text-blue-600 font-black">{Number(calcPackaging).toLocaleString()} ريال</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={calcPackaging}
                        onChange={(e) => setCalcPackaging(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold text-slate-800"
                      />
                    </div>

                    {/* Desired profit margin */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>نسبة الربح المستهدفة للتاجر (%)</span>
                        <span className="text-emerald-600 font-black">{calcProfitMargin}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={calcProfitMargin}
                        onChange={(e) => setCalcProfitMargin(e.target.value)}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>5% (ربح سريع)</span>
                        <span>25% (متوسط)</span>
                        <span>50%</span>
                        <span>100% (مضاعف)</span>
                      </div>
                    </div>

                    {/* Promotional Discount */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>خصم ترويجي للعميل (اختياري - ريال يمني)</span>
                        <span className="text-amber-600 font-black">{Number(calcDiscount).toLocaleString()} ريال</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={calcDiscount}
                        onChange={(e) => setCalcDiscount(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold text-slate-800"
                      />
                    </div>

                  </div>
                </div>

                {/* Results Column (Screen 2 Layout) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#0f2444] to-[#132c54] text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between border border-blue-500/30">
                  <div>
                    <h3 className="text-base font-black text-white border-b border-white/10 pb-4 mb-6 flex items-center justify-between">
                      <span>النتيجة المالية والتسعير</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        عمولة 2% فقط
                      </span>
                    </h3>

                    {/* Final Selling Price Display */}
                    <div className="p-5 rounded-2xl bg-white/[0.08] border border-white/10 text-center mb-6">
                      <div className="text-xs text-blue-200 font-semibold mb-1">سعر البيع المقترح النهائي للعميل</div>
                      <div className="text-3xl md:text-4xl font-black text-amber-300 tracking-tight">
                        {calcResults.finalPrice.toLocaleString()} <span className="text-sm font-normal text-white">ريال</span>
                      </div>
                      {calcDiscount > 0 && (
                        <div className="text-[11px] text-emerald-400 mt-1">
                          يشمل خصماً قدره {Number(calcDiscount).toLocaleString()} ريال
                        </div>
                      )}
                    </div>

                    {/* Detailed Breakdown */}
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between text-blue-200">
                        <span>إجمالي التكلفة (المنتج + التغليف):</span>
                        <span className="font-bold text-white font-mono">{calcResults.baseCost.toLocaleString()} ريال</span>
                      </div>

                      <div className="flex justify-between text-blue-200">
                        <span>إجمالي الربح الإجمالي للتاجر:</span>
                        <span className="font-bold text-emerald-300 font-mono">+{calcResults.desiredProfit.toLocaleString()} ريال</span>
                      </div>

                      <div className="flex justify-between text-blue-200 border-t border-white/10 pt-3">
                        <span className="flex items-center gap-1">
                          <span>عمولة منصة غيم سبيس (2%):</span>
                        </span>
                        <span className="font-bold text-blue-300 font-mono">-{calcResults.platformCommission.toLocaleString()} ريال</span>
                      </div>

                      <div className="flex justify-between text-sm font-black text-white border-t border-white/15 pt-3">
                        <span>صافي ربحك الفعلي المستلم:</span>
                        <span className="text-emerald-400 text-base font-mono">+{calcResults.netProfit.toLocaleString()} ريال</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 text-[11px] text-blue-200/70 text-center">
                    💡 عمولة غيم سبيس تخصم تلقائياً فقط عند تسليم الطلب للزبيل ونجاح العملية.
                  </div>
                </div>

              </div>

              {/* Ready Examples Table (Screen 2) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900">أمثلة ونماذج تسعير شائعة في السوق الحضرمي</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold">نوع المنتج</th>
                        <th className="pb-3 font-semibold">التكلفة الإجمالية</th>
                        <th className="pb-3 font-semibold">نسبة الربح</th>
                        <th className="pb-3 font-semibold">سعر البيع المقترح</th>
                        <th className="pb-3 font-semibold">عمولة المنصة (2%)</th>
                        <th className="pb-3 font-semibold">صافي ربح التاجر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      <tr>
                        <td className="py-3 font-bold text-slate-800">بخور مكلاوي ملكي (تولة)</td>
                        <td className="py-3 text-slate-600">8,000 ريال</td>
                        <td className="py-3 text-blue-600">30%</td>
                        <td className="py-3 font-bold text-slate-900">10,600 ريال</td>
                        <td className="py-3 text-slate-500">212 ريال</td>
                        <td className="py-3 font-bold text-emerald-600">+2,388 ريال</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800">عطر شرقي خاص (50 مل)</td>
                        <td className="py-3 text-slate-600">14,000 ريال</td>
                        <td className="py-3 text-blue-600">35%</td>
                        <td className="py-3 font-bold text-slate-900">19,250 ريال</td>
                        <td className="py-3 text-slate-500">385 ريال</td>
                        <td className="py-3 font-bold text-emerald-600">+4,865 ريال</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-bold text-slate-800">شموع معطرة باللبان الحوجري</td>
                        <td className="py-3 text-slate-600">5,500 ريال</td>
                        <td className="py-3 text-blue-600">40%</td>
                        <td className="py-3 font-bold text-slate-900">7,850 ريال</td>
                        <td className="py-3 text-slate-500">157 ريال</td>
                        <td className="py-3 font-bold text-emerald-600">+2,193 ريال</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================================
              TAB 4: PRODUCTS (Screen 7: المنتجات)
              ================================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              
              {/* Header Box with Add Button (Screen 7 Layout) */}
              <div className="bg-gradient-to-r from-[#11294a] to-[#1c4d87] rounded-3xl p-6 md:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl md:text-2xl font-black mb-1">كتالوج منتجات المتجر</h2>
                  <p className="text-xs md:text-sm text-blue-200">تحكم بالأسعار، المخزون، والخيارات المعروضة للزبائن</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setActiveTab('add-product');
                  }}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ إضافة منتج جديد</span>
                </button>
              </div>

              {/* 4 Stat Cards for Products (Screen 7 Layout) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">منتج مفعّل للبيع</div>
                  <div className="text-2xl font-black text-emerald-600">
                    {merchantProducts.filter(p => p.inStock > 0).length}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">إجمالي المنتجات</div>
                  <div className="text-2xl font-black text-blue-600">
                    {merchantProducts.length}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">بانتظار المراجعة</div>
                  <div className="text-2xl font-black text-amber-600">0</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">نفد من المخزون</div>
                  <div className="text-2xl font-black text-red-500">
                    {merchantProducts.filter(p => p.inStock === 0).length}
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="ابحث باسم المنتج..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="all">كافة الفئات</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                  >
                    <option value="all">كافة الحالات</option>
                    <option value="active">متوفر فقط</option>
                    <option value="out">نفد المخزون</option>
                  </select>
                </div>
              </div>

              {/* Products Table (Screen 7 Layout) */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="py-4 px-6 font-bold">المنتج</th>
                        <th className="py-4 px-4 font-bold">التصنيف</th>
                        <th className="py-4 px-4 font-bold">السعر</th>
                        <th className="py-4 px-4 font-bold">المخزون المتوفر</th>
                        <th className="py-4 px-4 font-bold">الحالة</th>
                        <th className="py-4 px-6 font-bold text-left">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            لا توجد منتجات مطابقة لخيارات البحث
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Product Info with Image */}
                            <td className="py-3.5 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=100&auto=format&fit=crop&q=80'}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-slate-900 text-sm">{prod.name}</div>
                                  <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{prod.description || 'بخور وعطور فاخرة'}</div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 text-slate-600 font-semibold">{prod.category || 'عام'}</td>

                            {/* Price */}
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {prod.price ? Number(prod.price).toLocaleString() : '15,000'} <span className="text-[10px] text-slate-400">ريال</span>
                            </td>

                            {/* Stock */}
                            <td className="py-3.5 px-4">
                              <span className={`font-bold ${prod.inStock > 5 ? 'text-slate-800' : prod.inStock > 0 ? 'text-amber-600' : 'text-red-500'}`}>
                                {prod.inStock || 0} قطعة
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                prod.inStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                              }`}>
                                {prod.inStock > 0 ? 'متوفر' : 'نفد'}
                              </span>
                            </td>

                            {/* Actions (Screen 7 buttons: View, Edit, Delete) */}
                            <td className="py-3.5 px-6 text-left">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleEditProductClick(prod)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                                  title="تعديل المنتج"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProductClick(prod.id, prod.name)}
                                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                                  title="حذف المنتج"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================================
              TAB 5: ADD / EDIT PRODUCT (Screen 8: إضافة منتج جديد)
              ================================================================== */}
          {activeTab === 'add-product' && (
            <div className="space-y-8">
              
              {/* Back to products button */}
              <button
                onClick={() => {
                  setEditingProductId(null);
                  setActiveTab('products');
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى قائمة المنتجات</span>
              </button>

              <form onSubmit={handleSaveProduct} className="space-y-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Product Images (Screen 8 Layout) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                      <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                        صور المنتج
                      </h3>

                      {/* Main Preview */}
                      <div className="w-full aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-blue-400 p-2 flex items-center justify-center relative overflow-hidden group">
                        <img
                          src={productForm.image}
                          alt="معاينة المنتج"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      {/* Image URL input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط صورة المنتج (URL)</label>
                        <input
                          type="url"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-left"
                          dir="ltr"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-700 leading-relaxed">
                        💡 يُفضل استخدام صور مربعة واضحة ذات خلفية بيضاء أو نقية للحصول على أفضل ظهور للمنتج في تطبيق غيم سبيس.
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Product Details (Screen 8 Layout) */}
                  <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">
                      {editingProductId ? 'تعديل تفاصيل المنتج' : 'بيانات وتفاصيل المنتج الجديد'}
                    </h3>

                    <div className="space-y-5">
                      
                      {/* Product Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">اسم المنتج *</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          placeholder="مثال: بخور مكلاوي فاخر - تولة ملكية"
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">وصف المنتج ومكوناته *</label>
                        <textarea
                          rows={3}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="اكتب وصفاً جذاباً يشمل المكونات وطريقة الاستخدام..."
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-medium leading-relaxed"
                          required
                        />
                      </div>

                      {/* Category & SubCategory */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">الفئة الرئيسية *</label>
                          <select
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold bg-white"
                          >
                            {categories.map((c, i) => (
                              <option key={i} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">الفئة الفرعية</label>
                          <input
                            type="text"
                            value={productForm.subCategory}
                            onChange={(e) => setProductForm({ ...productForm, subCategory: e.target.value })}
                            placeholder="مثال: بخور وعود"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-semibold"
                          />
                        </div>
                      </div>

                      {/* Default Price & Stock */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">السعر الأصلي (ريال) *</label>
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">سعر العرض / الخصم</label>
                          <input
                            type="number"
                            value={productForm.discountPrice}
                            onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                            placeholder="اختياري"
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-bold text-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">الكمية المتوفرة *</label>
                          <input
                            type="number"
                            value={productForm.inStock}
                            onChange={(e) => setProductForm({ ...productForm, inStock: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-sm font-bold"
                            required
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Sizes and Variants Table (Screen 8 Layout) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-black text-slate-900">الأحجام والأسعار المتعددة (Variants)</h3>
                      <p className="text-xs text-slate-500">أضف خيارات الأحجام أو الأوزان مع أسعارها الخاصة</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSizeRow}
                      className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ إضافة حجم / وزن</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100">
                          <th className="pb-3 font-semibold">الحجم / الخيار</th>
                          <th className="pb-3 font-semibold">الكمية المتوفرة</th>
                          <th className="pb-3 font-semibold">سعر المنتج</th>
                          <th className="pb-3 font-semibold">سعر العرض</th>
                          <th className="pb-3 font-semibold">الباركود / SKU</th>
                          <th className="pb-3 font-semibold text-left">حذف</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {productForm.sizes.map((s) => (
                          <tr key={s.id}>
                            <td className="py-2.5">
                              <input
                                type="text"
                                value={s.size}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductForm(prev => ({
                                    ...prev,
                                    sizes: prev.sizes.map(row => row.id === s.id ? { ...row, size: val } : row),
                                  }));
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-2.5">
                              <input
                                type="number"
                                value={s.stock}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductForm(prev => ({
                                    ...prev,
                                    sizes: prev.sizes.map(row => row.id === s.id ? { ...row, stock: Number(val) } : row),
                                  }));
                                }}
                                className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-2.5">
                              <input
                                type="number"
                                value={s.price}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductForm(prev => ({
                                    ...prev,
                                    sizes: prev.sizes.map(row => row.id === s.id ? { ...row, price: Number(val) } : row),
                                  }));
                                }}
                                className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold"
                              />
                            </td>
                            <td className="py-2.5">
                              <input
                                type="number"
                                value={s.offerPrice}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductForm(prev => ({
                                    ...prev,
                                    sizes: prev.sizes.map(row => row.id === s.id ? { ...row, offerPrice: val } : row),
                                  }));
                                }}
                                placeholder="اختياري"
                                className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-emerald-600"
                              />
                            </td>
                            <td className="py-2.5">
                              <input
                                type="text"
                                value={s.barcode}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setProductForm(prev => ({
                                    ...prev,
                                    sizes: prev.sizes.map(row => row.id === s.id ? { ...row, barcode: val } : row),
                                  }));
                                }}
                                className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                              />
                            </td>
                            <td className="py-2.5 text-left">
                              <button
                                type="button"
                                onClick={() => handleRemoveSizeRow(s.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setActiveTab('products');
                    }}
                    className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingProductId ? 'حفظ التعديلات' : 'نشر المنتج الآن في المتجر'}</span>
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ==================================================================
              TAB 6: ORDERS (Screen 4: الطلبات)
              ================================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-8">
              
              {/* 4 Stat Cards for Orders (Screen 4 Layout) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">إجمالي الطلبات</div>
                  <div className="text-2xl font-black text-slate-900">{orderStats.total}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">قيد الشحن والتوصيل</div>
                  <div className="text-2xl font-black text-blue-600">{orderStats.shipping}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">قيد المعالجة والتجهيز</div>
                  <div className="text-2xl font-black text-amber-600">{orderStats.processing}</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">طلبات مكتملة</div>
                  <div className="text-2xl font-black text-emerald-600">{orderStats.completed}</div>
                </div>
              </div>

              {/* Orders Filters */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="ابحث برقم الطلب أو اسم العميل..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">كافة حالات الطلب</option>
                  <option value="placed">جديد</option>
                  <option value="processing">قيد المعالجة والتجهيز</option>
                  <option value="ready_for_pickup">جاهز للاستلام والتوصيل</option>
                  <option value="delivered">مكتمل ومسلّم</option>
                </select>
              </div>

              {/* Orders Table (Screen 4 Layout) */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <th className="py-4 px-6 font-bold">رقم الطلب</th>
                        <th className="py-4 px-4 font-bold">العميل</th>
                        <th className="py-4 px-4 font-bold">المجموع</th>
                        <th className="py-4 px-4 font-bold">الحالة</th>
                        <th className="py-4 px-4 font-bold">التاريخ</th>
                        <th className="py-4 px-6 font-bold text-left">إجراءات ومعالجة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            لا توجد طلبات في هذا السجل حالياً
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-6 font-bold text-blue-600">{order.id}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{order.customer || 'عميل غيم'}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {(Number(order.total) || Number(order.amount) || 15000).toLocaleString()} <span className="text-[10px] text-slate-400">ريال</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                order.status === 'delivered' || order.status === 'مكتمل'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : order.status === 'ready_for_pickup' || order.status === 'delivering'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {order.status === 'delivered' ? 'مكتمل' : order.status === 'ready_for_pickup' ? 'جاهز للتوصيل' : 'قيد التجهيز'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">{order.date || 'اليوم'}</td>
                            <td className="py-3.5 px-6 text-left">
                              <div className="flex items-center justify-end gap-2">
                                {order.status !== 'ready_for_pickup' && order.status !== 'delivered' && (
                                  <button
                                    onClick={() => {
                                      markOrderReadyForPickup(order.id);
                                      showToast(`تم تجهيز الطلب ${order.id} وجعله جاهزاً للتوصيل 🛵`);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm transition-colors"
                                  >
                                    جاهز للتوصيل
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                                  title="عرض التفاصيل"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================================
              TAB 7: SALES & REPORTS (Screen 6: المبيعات والتقارير)
              ================================================================== */}
          {activeTab === 'sales' && (
            <div className="space-y-8">
              
              {/* Time Period Filter Tabs (Screen 6 Layout) */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex gap-2">
                  {[
                    { id: '30days', label: 'آخر 30 يوم' },
                    { id: '3months', label: 'آخر 3 أشهر' },
                    { id: 'year', label: 'آخر سنة' },
                    { id: 'custom', label: 'مخصص' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSalesPeriod(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        salesPeriod === tab.id ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500 font-semibold">
                  التقارير المالية الصادرة بالريال اليمني (YER)
                </div>
              </div>

              {/* 4 Stat Cards for Sales (Screen 6 Layout) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">عدد الطلبات</div>
                  <div className="text-2xl font-black text-slate-900">{stats.totalOrdersCount} طلب</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">إجمالي المبيعات</div>
                  <div className="text-2xl font-black text-blue-600">{stats.totalSales.toLocaleString()} ريال</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">أرباح التاجر الصافية</div>
                  <div className="text-2xl font-black text-emerald-600">{stats.merchantNetEarnings.toLocaleString()} ريال</div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="text-xs text-slate-500 font-semibold mb-1">عمولات المنصة المسددة (2%)</div>
                  <div className="text-2xl font-black text-slate-700">{stats.platformCommission.toLocaleString()} ريال</div>
                </div>
              </div>

              {/* Interactive SVG Sales Movement Chart */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">حركة المبيعات خلال الفترة</h3>
                    <p className="text-xs text-slate-500">مخطط بياني يوضح وتيرة نمو المبيعات</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>نمو بمعدل 18.4%</span>
                  </span>
                </div>

                {/* SVG Line Chart */}
                <div className="h-64 w-full pt-4">
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area under curve */}
                    <path
                      d="M 0 160 Q 100 130 200 110 T 400 60 T 600 30 L 600 200 L 0 200 Z"
                      fill="url(#salesGrad)"
                    />
                    {/* Line */}
                    <path
                      d="M 0 160 Q 100 130 200 110 T 400 60 T 600 30"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* Data dots */}
                    <circle cx="200" cy="110" r="5" fill="#2563eb" />
                    <circle cx="400" cy="60" r="5" fill="#2563eb" />
                    <circle cx="600" cy="30" r="5" fill="#2563eb" />
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-2">
                  <span>الأسبوع الأول</span>
                  <span>الأسبوع الثاني</span>
                  <span>الأسبوع الثالث</span>
                  <span>الأسبوع الحالي</span>
                </div>
              </div>

              {/* Subscriptions Log (Screen 6 Layout) */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900">سجل الاشتراكات الشهرية</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-semibold">رقم الفاتورة</th>
                        <th className="pb-3 font-semibold">الباقة</th>
                        <th className="pb-3 font-semibold">المبلغ</th>
                        <th className="pb-3 font-semibold">الحالة</th>
                        <th className="pb-3 font-semibold">تاريخ السداد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      <tr>
                        <td className="py-3 font-mono font-bold text-blue-600">INV-2026-11</td>
                        <td className="py-3 text-slate-800">باقة التاجر الفضي</td>
                        <td className="py-3 font-bold text-slate-900">6,000 ريال</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            مفعّل
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">1 نوفمبر 2026</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono font-bold text-blue-600">INV-2026-10</td>
                        <td className="py-3 text-slate-800">باقة التاجر الفضي</td>
                        <td className="py-3 font-bold text-slate-900">6,000 ريال</td>
                        <td className="py-3">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            مفعّل
                          </span>
                        </td>
                        <td className="py-3 text-slate-500">1 أكتوبر 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ==================================================================
              TAB 8: SETTINGS (الإعدادات)
              ================================================================== */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">
                  إعدادات التنبيهات والإشعارات
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'إشعارات الطلبات الجديدة عبر الواتساب', desc: 'استلام تنبيه فوري فور قيام العميل بالطلب', checked: true },
                    { label: 'تنبيهات انخفاض المخزون', desc: 'إشعارك عندما يتبقى أقل من 3 قطع من أي منتج', checked: true },
                    { label: 'تقارير المبيعات الأسبوعية', desc: 'ملخص أسبوعي للأرباح والمبيعات المحققة', checked: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                      <div>
                        <div className="text-xs font-bold text-slate-800">{item.label}</div>
                        <div className="text-[11px] text-slate-400">{item.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked={item.checked} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-4">
                  أمان الحساب
                </h3>
                <p className="text-xs text-slate-500">
                  حسابك محمي بواسطة نظام التحقق الموحد لمنصة غيم سبيس السحابية.
                </p>
                <button
                  type="button"
                  onClick={() => showToast('رابط إعادة تعيين كلمة المرور أُرسل إلى جوالك')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 9: SUPPORT (الدعم والمساعدة)
              ================================================================== */}
          {activeTab === 'support' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gradient-to-r from-[#0e213d] to-[#1a3d6d] text-white rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-black mb-2">مركز دعم تجار غيم سبيس 🎧</h2>
                <p className="text-blue-200 text-xs leading-relaxed">
                  فريقنا في المكلا متواجد على مدار الساعة لخدمتك والإجابة على استفساراتك وتذليل كافة العقبات.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="https://wa.me/967773058707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">تواصل عبر واتساب الدعم</div>
                    <div className="text-xs text-slate-500 font-mono" dir="ltr">+967 773 058 707</div>
                  </div>
                </a>

                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">البريد الإلكتروني للشكاوى</div>
                    <div className="text-xs text-slate-500 font-mono">support@ghaym.space</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* ==========================================================================
          MODALS
          ========================================================================== */}
      
      {/* 1. Add Bank Account Modal */}
      {newBankModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">إضافة حساب بنكي جديد</h3>
              <button onClick={() => setNewBankModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم البنك أو شركة الصرافة *</label>
                <select
                  value={newBankData.bank}
                  onChange={(e) => setNewBankData({ ...newBankData, bank: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                >
                  <option value="بنك الكريمي للتمويل الأصغر">بنك الكريمي للتمويل الأصغر</option>
                  <option value="شركة العمقي وإخوانه للصرافة">شركة العمقي وإخوانه للصرافة</option>
                  <option value="بنك التضامن">بنك التضامن</option>
                  <option value="بنك القطيبي الإسلامي">بنك القطيبي الإسلامي</option>
                  <option value="بنك البسيري">بنك البسيري</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم صاحب الحساب الثلاثي *</label>
                <input
                  type="text"
                  value={newBankData.accountName}
                  onChange={(e) => setNewBankData({ ...newBankData, accountName: e.target.value })}
                  placeholder="مثال: أحمد سعيد باقازي"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الحساب أو المحفظة *</label>
                <input
                  type="text"
                  value={newBankData.accountNumber}
                  onChange={(e) => setNewBankData({ ...newBankData, accountNumber: e.target.value })}
                  placeholder="مثال: 30129841"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setNewBankModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleAddBankAccount}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md"
              >
                تأكيد الإضافة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs text-blue-600 font-bold">تفاصيل الطلب</span>
                <h3 className="font-black text-slate-900 text-lg">{selectedOrder.id}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">اسم العميل:</span>
                <span className="font-bold text-slate-800">{selectedOrder.customer || 'عميل غيم سبيس'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">رقم الهاتف:</span>
                <span className="font-mono font-bold text-slate-800" dir="ltr">{selectedOrder.phone || '771234567'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">العنوان وموقع التسليم:</span>
                <span className="font-semibold text-slate-800">{selectedOrder.address || 'المكلا - الديس'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">المبلغ الإجمالي:</span>
                <span className="font-black text-blue-600 text-sm">{(Number(selectedOrder.total) || Number(selectedOrder.amount) || 15000).toLocaleString()} ريال</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Subscription Payment Modal */}
      {isPaymentModalOpen && (
        <MerchantPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          invoice={selectedInvoice || { id: 'INV-NEW', amount: 6000, description: 'تجديد باقة التاجر الفضي' }}
          merchantStore={merchantStore}
          onSuccess={() => {
            setIsPaymentModalOpen(false);
            showToast('تم إرسال طلب تجديد الاشتراك بنجاح ✨');
          }}
        />
      )}

    </div>
  );
}
