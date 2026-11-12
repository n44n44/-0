import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Tag,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Star,
  ChevronDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Gift,
  ExternalLink,
  Store,
  Plus,
  Sparkles,
  Bot,
  Eye,
  Trash2,
  Edit,
  Search,
  Check,
  DollarSign,
  AlertTriangle,
  Send,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Building,
  Phone,
  Image as ImageIcon,
  Building2,
  Copy,
  Receipt,
  FileCheck,
} from 'lucide-react';
import GhaymLogo from '../components/GhaymLogo';
import MerchantPaymentModal from '../components/MerchantPaymentModal';
import YemeniPhoneInput from '../components/YemeniPhoneInput';
import { validateYemeniPhone, cleanYemeniPhone } from '../utils/phoneValidation';
import { usePlatform, calculateDaysRemaining } from '../context/PlatformContext';

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

  // Scoped isolated data for current merchant
  const products = merchantProducts;
  const orders = merchantOrders;

  // Active Navigation Tab
  // 'dashboard' | 'products' | 'orders' | 'inventory' | 'store-profile' | 'sales' | 'finances' | 'notifications' | 'reviews' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('أسبوع');

  // Modals state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);

  // Manual Product Form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 24000,
    discountPrice: '',
    category: 'بخور وعطور',
    description: '',
    inStock: 15,
    sizes: 'صغير, وسط, كبير',
    colors: 'ذهبي, فضي',
    images: ['https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'],
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
    isVisible: true,
  });
  const [newImageUrlInput, setNewImageUrlInput] = useState('');

  // AI Generator Form
  const [aiPrompt, setAiPrompt] = useState('بخور مكلاوي فاخر مسقى بالعود ومسك الغزال');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Store Profile Edit Form
    const [storeForm, setStoreForm] = useState({
    name: merchantStore?.name || 'متجر وردة الأناقة',
    description: merchantStore?.description || '',
    city: merchantStore?.city || 'المكلا',
    neighborhood: merchantStore?.neighborhood || 'حي الورد - المكلا',
    phone: currentMerchantUser?.phone || '771234567',
    whatsapp: merchantStore?.whatsapp || currentMerchantUser?.whatsapp || '771234567',
    coverImage: merchantStore?.coverImage || merchantStore?.cover || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    logo: merchantStore?.image || merchantStore?.logo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    kuraimiAccount: currentMerchantUser?.kuraimiAccount || '30129841',
    omgyAccount: currentMerchantUser?.omgyAccount || 'AMQ-889021',
  });

  // Update store form when active merchant store changes
  React.useEffect(() => {
    if (merchantStore) {
      setStoreForm({
        name: merchantStore.name || 'متجر وردة الأناقة',
        description: merchantStore.description || '',
        city: merchantStore.city || 'المكلا',
        neighborhood: 'حي الورد - المكلا',
        phone: currentMerchantUser?.phone || '771234567',
        coverImage: merchantStore.coverImage || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
        logo: merchantStore.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      });
    }
  }, [merchantStore?.id, currentMerchantUser?.id]);

  // Withdrawal form
  const [withdrawAmount, setWithdrawAmount] = useState(150000);
  const [withdrawBank, setWithdrawBank] = useState('الكريمي');
  const [withdrawAccount, setWithdrawAccount] = useState('30129841');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Reviews state with merchant reply
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      customer: 'أروى العطاس',
      rating: 5,
      date: 'منذ يومين',
      productName: 'شموع معطرة بلبان الحوجري واللافندر',
      comment: 'ما شاء الله الرائحة خيال وثابتة لأيام في الغرفة، والتغليف راقي جداً!',
      reply: 'شكراً جزيلاً أختي أروى، نسعد دائماً بخدمتك ونتمنى لك دوام الراحة والسكينة 🌸',
    },
    {
      id: 'rev-2',
      customer: 'صالح العمودي',
      rating: 5,
      date: 'منذ 4 أيام',
      productName: 'مباخر دقة عود مكلاوي أصلي',
      comment: 'العود أصلي ونظيف ودخانه كثيف وبارد، فخر الصناعة المكلاوية.',
      reply: null,
    },
    {
      id: 'rev-3',
      customer: 'منى باوزير',
      rating: 4,
      date: 'منذ أسبوع',
      productName: 'أسمنت كونكريت تحف فنية بحرية',
      comment: 'القطعة ممتازة وجودة الصب والتشطيب عالية جداً.',
      reply: 'أهلاً بكِ أختي منى، رأيك وسام لنا وجاري تجهيز تشكيلة جديدة قريباً ✨',
    },
  ]);
  const [replyText, setReplyText] = useState({});

  // Menu Items matching Image 3 Top exactly with Finances Tab
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products', label: 'منتجاتي (إدارة المنتجات)', icon: Package, badge: `${products.length}` },
    { id: 'orders', label: 'طلباتي (إدارة الطلبات)', icon: ShoppingBag, badge: `${orders.length}` },
    { id: 'inventory', label: 'المخزون والأسعار', icon: Tag },
    { id: 'sales', label: 'مبيعاتي والأرباح', icon: TrendingUp },
    {
      id: 'finances',
      label: 'الاشتراك والمدفوعات البنكية',
      icon: CreditCard,
      badge: merchantSubscription?.status === 'expiring_soon' ? 'مستحق' : null,
    },
    { id: 'store-profile', label: 'بيانات المتجر والغلاف', icon: Store },
    { id: 'reviews', label: 'التقييمات والمراجعات', icon: Star },
    { id: 'notifications', label: 'الإشعارات', icon: Bell, badge: `${notifications.filter(n => n.unread).length || ''}` },
    { id: 'settings', label: 'إعدادات الحساب والبنك', icon: Settings },
  ];

  // Sales data points for 7 days chart (Image 3 Top)
  const salesData = [
    { day: 'السبت', val: 520, height: '35%' },
    { day: 'الأحد', val: 680, height: '45%' },
    { day: 'الإثنين', val: 610, height: '40%' },
    { day: 'الثلاثاء', val: 950, height: '65%' },
    { day: 'الأربعاء', val: 820, height: '55%' },
    { day: 'الخميس', val: 1100, height: '75%' },
    { day: 'الجمعة', val: 1450, height: '95%' },
  ];

  // Manual Add submit

  // Helper for adding multi-images to newProduct
  const handleAddNewProductImage = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result;
        setNewProduct((prev) => {
          const imgs = prev.images || [];
          return {
            ...prev,
            images: [...imgs, base64],
            image: prev.image || base64,
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (!newImageUrlInput.trim()) return;
    setNewProduct((prev) => {
      const imgs = prev.images || [];
      return {
        ...prev,
        images: [...imgs, newImageUrlInput.trim()],
        image: prev.image || newImageUrlInput.trim(),
      };
    });
    setNewImageUrlInput('');
  };

  const handleRemoveNewProductImage = (idx) => {
    setNewProduct((prev) => {
      const imgs = (prev.images || []).filter((_, i) => i !== idx);
      return {
        ...prev,
        images: imgs,
        image: imgs[0] || '',
      };
    });
  };

  const handleSetPrimaryImage = (img) => {
    setNewProduct((prev) => ({
      ...prev,
      image: img,
    }));
  };

  // Helper for adding multi-images to editingProduct
  const handleEditProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target.result;
        setEditingProduct((prev) => {
          const imgs = prev.images || [];
          return {
            ...prev,
            images: [...imgs, base64],
            image: prev.image || base64,
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveEditingProductImage = (idx) => {
    setEditingProduct((prev) => {
      const imgs = (prev.images || []).filter((_, i) => i !== idx);
      return {
        ...prev,
        images: imgs,
        image: imgs[0] || '',
      };
    });
  };

  const handleAddManualProduct = (e) => {
    e.preventDefault();
    const primaryImg = (newProduct.images && newProduct.images.length > 0) ? newProduct.images[0] : (newProduct.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80');
    
    addProduct({
      name: newProduct.name,
      price: Number(newProduct.price),
      discountPrice: newProduct.discountPrice ? Number(newProduct.discountPrice) : null,
      originalPrice: newProduct.discountPrice ? Number(newProduct.price) : Number(newProduct.price) * 1.2,
      category: newProduct.category,
      images: newProduct.images?.length > 0 ? newProduct.images : [primaryImg],
      image: primaryImg,
      description: newProduct.description,
      inStock: Number(newProduct.inStock) || 15,
      sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()) : [],
      colors: newProduct.colors ? newProduct.colors.split(',').map(c => c.trim()) : [],
      isVisible: newProduct.isVisible !== false,
      badge: newProduct.discountPrice ? `خصم ${Math.round((1 - Number(newProduct.discountPrice) / Number(newProduct.price)) * 100)}%` : 'جديد ✨',
    });
    
    setIsManualModalOpen(false);
    setNewProduct({
      name: '',
      price: 24000,
      discountPrice: '',
      category: categories[0]?.name || 'بخور وعطور',
      description: '',
      inStock: 15,
      sizes: '',
      colors: '',
      images: ['https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'],
      image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80',
      isVisible: true,
    });
    setActiveTab('products');
  };

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const primaryImg = (editingProduct.images && editingProduct.images.length > 0) ? editingProduct.images[0] : (editingProduct.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80');
    
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : null,
      category: editingProduct.category,
      inStock: Number(editingProduct.inStock),
      description: editingProduct.description,
      images: editingProduct.images?.length > 0 ? editingProduct.images : [primaryImg],
      image: primaryImg,
      sizes: typeof editingProduct.sizes === 'string' ? editingProduct.sizes.split(',').map(s => s.trim()) : editingProduct.sizes,
      colors: typeof editingProduct.colors === 'string' ? editingProduct.colors.split(',').map(c => c.trim()) : editingProduct.colors,
      isVisible: editingProduct.isVisible !== false,
      badge: editingProduct.discountPrice ? `خصم ${Math.round((1 - Number(editingProduct.discountPrice) / Number(editingProduct.price)) * 100)}%` : editingProduct.badge,
    });
    setEditingProduct(null);
  };

  // AI Assistant Generator Logic
  const handleGenerateWithAi = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);

    setTimeout(() => {
      setIsGeneratingAi(false);
      const generated = {
        name: aiPrompt.includes('بخور')
          ? 'بخور مكلاوي ملكي مسقى بالعود والمسك المعتق'
          : aiPrompt.includes('شمع')
          ? 'شموع معطرة بزيوت اللبان الحوجري وخشب الصندل'
          : `تحف ${aiPrompt} - إصدار حضرمي حصري`,
        price: 24000,
        category: aiPrompt.includes('بخور')
          ? 'بخور وعطور'
          : aiPrompt.includes('شمع')
          ? 'ديكور وهدايا'
          : 'صناعات يدوية',
        description:
          'منتج يدوي مميز محضر بأعلى معايير الإتقان والجودة بأيدي أسر منتجة في المكلا، معبأ بعناية فائقة ليعكس التراث الحضرمي الأصيل ويدوم طويلاً.',
        image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800&auto=format&fit=crop&q=80',
        badge: 'توليد ذكاء اصطناعي ✨',
        inStock: 20,
      };
      setAiResult(generated);
    }, 1000);
  };

  const handleConfirmAiProduct = () => {
    if (aiResult) {
      addProduct(aiResult);
      setAiResult(null);
      setIsAiModalOpen(false);
      setActiveTab('products');
    }
  };


  // Save store profile
  const handleSaveStoreProfile = (e) => {
    e.preventDefault();
    updateMerchantStore({
      name: storeForm.name,
      description: storeForm.description,
      city: storeForm.city,
      image: storeForm.logo,
    });
    alert('تم حفظ وتحديث بيانات المتجر بنجاح!');
  };

  // Submit merchant review reply
  const handleAddReviewReply = (revId) => {
    const text = replyText[revId];
    if (!text || !text.trim()) return;
    setReviewsList((prev) =>
      prev.map((r) => (r.id === revId ? { ...r, reply: text.trim() } : r))
    );
    setReplyText((prev) => ({ ...prev, [revId]: '' }));
  };

  // Submit withdrawal
  const handleWithdrawalSubmit = (e) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 2000);
  };

  // Financial calculations - Strictly computed from real store orders (zero state for new merchants)
  const totalMerchantSales = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const platformFee = Math.round(totalMerchantSales * 0.05);
  const netEarnings = totalMerchantSales - platformFee;

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col md:flex-row text-[#172A46]" dir="rtl">
      {/* 1. SIDEBAR (Matching Image 3 Top) */}
      <aside className="w-full md:w-64 bg-[#172A46] text-white flex flex-col justify-between shrink-0 shadow-2xl border-l border-[#233f66]">
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-[#233f66] flex items-center justify-between">
            <GhaymLogo size="md" subtitle="Grow Together" />
          </div>

          {/* Multi-Tenant Merchant Account Switcher */}
          <div className="px-4 py-3 bg-[#0c182c] border-b border-[#233f66] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Store className="w-3.5 h-3.5" />
                <span>حساب التاجر النشط:</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                {merchantStore?.id}
              </span>
            </div>

            <div className="relative">
              <select
                value={currentMerchantUser?.id}
                onChange={(e) => switchMerchantAccount(e.target.value)}
                className="w-full bg-[#172A46] text-white text-xs font-bold py-2 pr-2 pl-7 rounded-xl border border-sky-500/40 focus:outline-none focus:ring-2 focus:ring-[#54B9F2] appearance-none cursor-pointer"
              >
                {merchantsList.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#172A46] text-white">
                    {m.name} — {m.storeName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-sky-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 text-xs font-bold">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                    isActive
                      ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#172A46] text-white' : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back and Logout */}
        <div className="p-4 border-t border-[#233f66] space-y-2">
          {onBackToMarket && (
            <button
              onClick={onBackToMarket}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-bold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>العودة لواجهة السوق</span>
            </button>
          )}

          <button
            onClick={() => alert('تم تسجيل خروج التاجر')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F3F6FB] border border-slate-200 text-xs font-bold text-[#172A46]">
              <Store className="w-4 h-4 text-[#54B9F2]" />
              <span>{merchantStore?.name || 'متجر وردة الأناقة'}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                موثق معتمد ✅
              </span>
            </div>

            {/* Quick Add Product Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#172A46] text-white hover:bg-[#233f66] text-xs font-bold transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة منتج يدوياً</span>
              </button>

              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs transition shadow-sm hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>إضافة بالـ AI ✨</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('notifications')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition relative"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              )}
            </button>

            <div className="flex items-center gap-2.5 pr-2 border-r border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#172A46] to-[#25426d] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {currentMerchantUser?.name?.[0] || 'ت'}
              </div>
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-[#172A46]">{currentMerchantUser?.name}</span>
                <span className="text-[10px] text-slate-400">{merchantStore?.city || 'المكلا'} • {currentMerchantUser?.phone}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Views Routing */}
        <div className="p-6 space-y-6">
        {/* Pending Approval Notice Banner */}
        {currentMerchantUser?.status === 'pending_approval' && (
          <div className="mx-6 mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
                ⏱️
              </div>
              <div>
                <h4 className="font-bold text-amber-950">طلب تسجيل متجرك قيد المراجعة والاعتماد من قبل إدارة غيم سبيس</h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  يمكنك الآن إضافة منتجاتك وصورك وأسعارك وتجهيز متجرك بالكامل. ستظهر منتجاتك تلقائياً للعملاء في المنصة فور موافقة الإدارة.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-200/80 rounded-xl font-bold text-[11px] shrink-0">
              بانتظار موافقة الإدارة
            </span>
          </div>
        )}
          {/* TAB 1: OVERVIEW DASHBOARD (Matching Image 3 Top) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Onboarding Empty-State Widget for New Merchants (Zero State) */}
              {products.length === 0 && (
                <div className="mb-6 bg-gradient-to-r from-sky-50 via-white to-blue-50 border-2 border-dashed border-[#38BDF8]/60 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#38BDF8]/15 text-[#0F1D38] flex items-center justify-center mx-auto border border-[#38BDF8]/30 shadow-inner">
                    <Package className="w-8 h-8 text-[#38BDF8]" />
                  </div>
                  <div className="space-y-1.5 max-w-lg mx-auto">
                    <h3 className="text-base sm:text-lg font-black text-[#0F1D38]">
                      مرحباً بك في متجرك! لم تقم بإضافة أي منتج بعد
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      بيانات متجرك وحساباتك البنكية ({merchantStore?.name} • {merchantStore?.city || 'المكلا'} • {currentMerchantUser?.phone}) مسجلة بنجاح. ابدأ الآن برفع أول منتج يدوي أو حرفي ليظهر فوراً في المنصة الرئيسية ويبدأ زبائن حضرموت بالشراء!
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => setIsManualModalOpen(true)}
                      className="px-8 py-3 rounded-2xl bg-[#0F1D38] hover:bg-[#1a335c] text-[#F2C044] font-black text-sm shadow-lg shadow-sky-950/20 transition transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5 text-[#F2C044]" />
                      <span>+ أضف منتجك الأول</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 5 Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. إجمالي المبيعات */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">إجمالي المبيعات</span>
                    <span className="text-xl font-black text-[#172A46] mt-1 block font-mono">
                      {totalMerchantSales.toLocaleString()} ر.ي
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>↑ 12%</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#54B9F2] flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                {/* 2. الطلبات الجديدة */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">الطلبات الجديدة</span>
                    <span className="text-xl font-black text-[#172A46] mt-1 block font-mono">{orders.length}</span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>↑ 8%</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                {/* 3. إجمالي المنتجات */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">إجمالي المنتجات</span>
                    <span className="text-xl font-black text-[#172A46] mt-1 block font-mono">
                      {products.length}
                    </span>
                    <span className="text-[11px] text-[#54B9F2] font-bold mt-1 block">نشطة في السوق</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Tag className="w-6 h-6" />
                  </div>
                </div>

                {/* 4. متوسط التقييم */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold block">متوسط التقييم</span>
                    <span className="text-xl font-black text-[#172A46] mt-1 block">4.8</span>
                    <div className="flex items-center gap-0.5 mt-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Star className="w-6 h-6 fill-amber-400" />
                  </div>
                </div>

                {/* 5. مرحباً بك في لوحة تحكم التاجر */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-4 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
                  <div>
                    <h4 className="text-xs font-black text-[#172A46]">مرحباً بك في لوحة تحكم التاجر</h4>
                    <p className="text-[10px] text-slate-500 mt-1">إدارة متجرك بكل سهولة واحترافية</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-[#54B9F2]" />
                  </div>
                </div>
              </div>

              {/* Chart & Recent Orders & 3D Promo Section (Matching Image 3 Top) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Chart (6 Cols) */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#172A46]">المبيعات خلال آخر 7 أيام</h3>
                      <span className="text-xs text-slate-400">معدل الإيرادات اليومية</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F3F6FB] border border-slate-200 text-xs font-bold text-[#172A46]">
                      <span>{timeFilter}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* SVG Chart with axes: 0, 500, 1000, 1500 */}
                  <div className="relative pt-4">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono pb-2 border-b border-slate-100">
                      <span>0</span>
                      <span>500</span>
                      <span>1,000</span>
                      <span>1,500</span>
                    </div>

                    <div className="flex items-end justify-between pr-4 pl-2 pt-6 h-48 border-b border-slate-100">
                      {salesData.map((d) => (
                        <div key={d.day} className="flex flex-col items-center gap-2 group flex-1">
                          <div className="relative w-full flex items-end justify-center h-36">
                            <div
                              style={{ height: d.height }}
                              className="w-5 sm:w-7 rounded-t-lg bg-gradient-to-t from-[#172A46] to-[#54B9F2] group-hover:from-[#54B9F2] group-hover:to-sky-300 transition-all duration-300 relative shadow-sm"
                            >
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#172A46] text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
                                {d.val} ريال
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{d.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders (3 Cols) matching Image 3 Top (#1045, #1044, #1043) */}
                <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-[#172A46]">أحدث الطلبات</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#54B9F2] font-bold hover:underline"
                    >
                      عرض الكل ➔
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl border border-slate-100 bg-[#F3F6FB]/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#172A46] font-mono">#1045</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            تم التوصيل
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">منذ ساعة</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        📦
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl border border-slate-100 bg-[#F3F6FB]/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#172A46] font-mono">#1044</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                            قيد التوصيل
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">منذ ساعتين</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        📦
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl border border-slate-100 bg-[#F3F6FB]/80 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#172A46] font-mono">#1043</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            قيد التجهيز
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">منذ 3 ساعات</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                        📦
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="w-full py-2.5 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition text-center"
                  >
                    إدارة وتجهيز كافة الطلبات
                  </button>
                </div>

                {/* 3D Blue Gift Box Promo Card (3 Cols) matching Image 3 Top */}
                <div className="lg:col-span-3 bg-gradient-to-b from-[#11243e] via-[#0d1c31] to-[#07111f] text-white rounded-3xl p-6 shadow-xl border border-[#233f66] flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-[#54B9F2] inline-block">
                      تخفيضات وعروض
                    </span>
                    <h3 className="text-lg font-black text-white leading-tight">
                      عروض مميزة
                    </h3>
                    <p className="text-xs text-sky-200">على منتجات مختارة</p>
                  </div>

                  {/* 3D Gift Box Visual Graphic */}
                  <div className="my-4 flex items-center justify-center relative z-10">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-3 shadow-2xl flex items-center justify-center transform rotate-6 border border-sky-300/40 relative">
                      <Gift className="w-12 h-12 text-white" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center shadow">
                        %
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onBackToMarket ? onBackToMarket() : null}
                    className="w-full py-3 rounded-xl bg-[#54B9F2] hover:bg-sky-400 text-[#172A46] font-black text-xs transition shadow-md flex items-center justify-center gap-2 relative z-10"
                  >
                    <span>تسوق الآن ➔</span>
                  </button>
                </div>
              </div>
            </>
          )}

                    {/* TAB 2: PRODUCTS MANAGEMENT (إدارة المنتجات - إضافة، تعديل، حذف) */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#54B9F2]" />
                    <span>إدارة منتجات المتجر ({products.length} منتج)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    إضافة وتعديل وحذف المنتجات الحرفية وتحديد الأسعار والخصومات والكميات بالمخزون
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsManualModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#172A46] text-white hover:bg-[#233f66] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#54B9F2]" />
                    <span>+ إضافة منتج جديد</span>
                  </button>

                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>توليد بالـ AI ✨</span>
                  </button>
                </div>
              </div>

              {/* Products Table or Empty State */}
              {products.length === 0 ? (
                <div className="py-14 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-sky-50 text-[#54B9F2] flex items-center justify-center mx-auto border border-sky-100 shadow-sm">
                    <Package className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#172A46]">لا توجد منتجات مضافة حتى الآن في متجرك</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      ابدأ الآن بإضافة أول منتج يدوي أو تقليدي لجذب الزبائن والأسر في المكلا وحضرموت وعرض إبداعاتك!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsManualModalOpen(true)}
                    className="px-6 py-2.5 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white font-black text-xs transition inline-flex items-center gap-2 shadow-md"
                  >
                    <Plus className="w-4 h-4 text-[#54B9F2]" />
                    <span>إضافة أول منتج في متجرك</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="pb-3 px-3">المنتج والصور</th>
                        <th className="pb-3 px-3">التصنيف</th>
                        <th className="pb-3 px-3">السعر (ر.ي)</th>
                        <th className="pb-3 px-3">المخزون المتوفر</th>
                        <th className="pb-3 px-3">حالة العرض</th>
                        <th className="pb-3 px-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm bg-slate-100">
                                <img
                                  src={prod.image || prod.images?.[0] || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                                {(prod.images?.length || 1) > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] px-1 font-bold rounded-tl">
                                    +{prod.images.length}
                                  </span>
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-[#172A46] flex items-center gap-1.5">
                                  <span>{prod.name}</span>
                                  {prod.badge && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                                      {prod.badge}
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                                  {prod.description || 'منتج مصنوع يدوياً بحب وإتقان في حضرموت'}
                                </p>
                                {((prod.sizes && prod.sizes.length > 0) || (prod.colors && prod.colors.length > 0)) && (
                                  <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500">
                                    {prod.sizes && prod.sizes.length > 0 && (
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                                        مقاسات: {Array.isArray(prod.sizes) ? prod.sizes.join('، ') : prod.sizes}
                                      </span>
                                    )}
                                    {prod.colors && prod.colors.length > 0 && (
                                      <span className="bg-slate-100 px-1.5 py-0.5 rounded">
                                        ألوان: {Array.isArray(prod.colors) ? prod.colors.join('، ') : prod.colors}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-medium text-slate-600">
                            <span className="px-2 py-1 rounded-lg bg-[#F3F6FB] text-slate-700 font-bold">
                              {prod.category}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono">
                            {prod.discountPrice && Number(prod.discountPrice) < Number(prod.price) ? (
                              <div className="space-y-0.5">
                                <span className="font-black text-[#54B9F2] block text-sm">
                                  {Number(prod.discountPrice).toLocaleString()} ر.ي
                                </span>
                                <span className="text-[10px] text-slate-400 line-through block">
                                  {Number(prod.price).toLocaleString()} ر.ي
                                </span>
                              </div>
                            ) : (
                              <span className="font-black text-[#172A46] text-sm">
                                {Number(prod.price).toLocaleString()} ر.ي
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateProductStock(prod.id, Math.max(0, (prod.inStock || 0) - 1))}
                                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                title="إنقاص الكمية"
                              >
                                -
                              </button>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                  (prod.inStock || 0) === 0
                                    ? 'bg-red-50 text-red-700 border border-red-200'
                                    : (prod.inStock || 0) < 5
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700'
                                }`}
                              >
                                {prod.inStock || 0} متوفر
                              </span>
                              <button
                                onClick={() => updateProductStock(prod.id, (prod.inStock || 0) + 1)}
                                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                                title="زيادة الكمية"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <button
                              onClick={() => updateProduct(prod.id, { isVisible: prod.isVisible === false ? true : false })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition flex items-center gap-1 ${
                                prod.isVisible !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${prod.isVisible !== false ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              <span>{prod.isVisible !== false ? 'معروض للبيع' : 'مخفي مؤقتاً'}</span>
                            </button>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setEditingProduct({ ...prod })}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                                title="تعديل المنتج"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف منتج "${prod.name}"؟`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

                    {/* TAB 3: ORDERS MANAGEMENT (إدارة الطلبات وتحديث حالاتها) */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#172A46]">إدارة وتجهيز طلبات العملاء ({orders.length})</h3>
                  <p className="text-xs text-slate-500">
                    عند تجهيز الطلب، اضغط على "جاهز للاستلام" لكي يظهر فوراً لمندوب التوصيل في المكلا 🛵
                  </p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-14 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-[#172A46]">لا توجد طلبات جديدة لمتجرك حتى الآن</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      ستظهر هنا جميع طلبات الشراء الواردة من عملاء غيم سبيس فور إتمامها، لتتمكن من تجهيزها وتسليمها للمندوب.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-[#F3F6FB]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#172A46]">{ord.id}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : ord.status === 'ready_for_pickup'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : ord.status === 'on_the_way'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {ord.statusLabel || ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                          <p><strong className="text-slate-800">العميل:</strong> {ord.customerName} ({ord.phone})</p>
                          <p><strong className="text-slate-800">العنوان:</strong> {ord.address}</p>
                          <p><strong className="text-slate-800">طريقة الدفع:</strong> {ord.paymentMethod} {ord.paymentRef ? `(مرجع: ${ord.paymentRef})` : ''}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-black text-sm text-[#54B9F2] font-mono">
                          {ord.total?.toLocaleString()} ر.ي
                        </span>

                        {ord.status === 'pending' && (
                          <button
                            onClick={() => markOrderReadyForPickup(ord.id)}
                            className="px-3.5 py-2 rounded-xl bg-[#54B9F2] text-[#172A46] font-black text-xs hover:bg-sky-400 transition shadow-sm"
                          >
                            جاهز لاستلام المندوب 📦
                          </button>
                        )}

                        {ord.status === 'ready_for_pickup' && (
                          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                            بانتظار قبول المندوب... 🛵
                          </span>
                        )}

                        {ord.status === 'on_the_way' && (
                          <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                            مع المندوب في الطريق 🛵
                          </span>
                        )}

                        {ord.status === 'delivered' && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            تم التسليم للعميل ✅
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INVENTORY & PRICES (إدارة المخزون والأسعار) */}
          {activeTab === 'inventory' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#54B9F2]" />
                    <span>إدارة المخزون والأسعار السريعة</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    عدّل كميات القطع المتوفرة والأسعار بالريال اليمني مباشرة دون الحاجة للدخول لصفحة المنتج
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="pb-3 px-3">المنتج</th>
                      <th className="pb-3 px-3">السعر الحالي (ر.ي)</th>
                      <th className="pb-3 px-3">كمية المخزون</th>
                      <th className="pb-3 px-3">حالة التوفر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3 font-bold text-[#172A46]">
                          <div className="flex items-center gap-2">
                            <img src={prod.image} alt={prod.name} className="w-8 h-8 rounded-lg object-cover" />
                            <span>{prod.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <input
                            type="number"
                            defaultValue={prod.price}
                            onBlur={(e) => updateProduct(prod.id, { price: Number(e.target.value) })}
                            className="w-28 bg-[#F3F6FB] border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#172A46] focus:border-[#54B9F2] focus:outline-none"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <input
                            type="number"
                            defaultValue={prod.inStock || 15}
                            onBlur={(e) => updateProductStock(prod.id, e.target.value)}
                            className="w-20 bg-[#F3F6FB] border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-[#172A46] focus:border-[#54B9F2] focus:outline-none"
                          />
                        </td>

                        <td className="py-3 px-3">
                          {(prod.inStock || 15) < 5 ? (
                            <span className="text-red-600 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>مخزون منخفض! سارع بالتجهيز</span>
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold">متوفر بكمية كافية ✅</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          

                    {/* TAB 5: STORE PROFILE & BRANDING (إدارة بيانات المتجر والغلاف) */}
          {activeTab === 'store-profile' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#172A46]">بيانات وهوية المتجر والحسابات</h3>
                <p className="text-xs text-slate-500">
                  تعديل اسم المتجر، النبذة التعريفية، الشعار، صورة الغلاف، أرقام التواصل والحسابات البنكية لاستلام الأرباح
                </p>
              </div>

              <form onSubmit={handleSaveStoreProfile} className="space-y-5 text-xs">
                {/* Cover & Logo Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cover */}
                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">غلاف المتجر (Cover Banner)</label>
                    <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img src={storeForm.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <input
                      type="text"
                      value={storeForm.coverImage}
                      onChange={(e) => setStoreForm({ ...storeForm, coverImage: e.target.value })}
                      className="w-full mt-2 bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                      placeholder="رابط صورة الغلاف..."
                    />
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">شعار المتجر (Logo)</label>
                    <div className="flex flex-col items-center justify-center p-3 border border-slate-200 rounded-2xl bg-slate-50 gap-2">
                      <img src={storeForm.logo} alt="Logo" className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                      <input
                        type="text"
                        value={storeForm.logo}
                        onChange={(e) => setStoreForm({ ...storeForm, logo: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-800"
                        placeholder="رابط الشعار..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم المتجر الرسمي</label>
                    <input
                      type="text"
                      required
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المدينة في حضرموت</label>
                    <input
                      type="text"
                      value={storeForm.city}
                      onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <YemeniPhoneInput
                    label="رقم هاتف التاجر المعتمد"
                    required={true}
                    value={storeForm.phone}
                    onChange={(cleaned) => setStoreForm({ ...storeForm, phone: cleaned })}
                    id="merchant-edit-phone"
                  />

                  <YemeniPhoneInput
                    label="رقم الواتساب للطلبات"
                    required={false}
                    value={storeForm.whatsapp}
                    onChange={(cleaned) => setStoreForm({ ...storeForm, whatsapp: cleaned })}
                    id="merchant-edit-wa"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رقم حساب الكريمي (كريمي جوال)</label>
                    <input
                      type="text"
                      value={storeForm.kuraimiAccount}
                      onChange={(e) => setStoreForm({ ...storeForm, kuraimiAccount: e.target.value })}
                      placeholder="مثال: 30129841"
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رقم حساب العمقي للصرافة</label>
                    <input
                      type="text"
                      value={storeForm.omgyAccount}
                      onChange={(e) => setStoreForm({ ...storeForm, omgyAccount: e.target.value })}
                      placeholder="مثال: AMQ-889021"
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">نبذة عن المتجر والمنتجات</label>
                  <textarea
                    rows={3}
                    value={storeForm.description}
                    onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#54B9F2] text-[#172A46] font-black hover:bg-sky-400 transition shadow-md"
                  >
                    حفظ التعديلات وتحديث واجهة المتجر
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: SALES & EARNINGS (متابعة المبيعات والأرباح) */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-bold">إجمالي المبيعات المحققة</span>
                  <span className="text-2xl font-black text-[#172A46] block font-mono">
                    {totalMerchantSales.toLocaleString()} ر.ي
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block">مكتملة ومؤكدة ✅</span>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs text-slate-500 font-bold">عمولة منصة غيم سبيس (5%)</span>
                  <span className="text-2xl font-black text-slate-600 block font-mono">
                    {platformFee.toLocaleString()} ر.ي
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold block">تشمل الاستضافة والتسويق</span>
                </div>

                <div className="bg-gradient-to-r from-[#172A46] to-[#25426d] text-white rounded-3xl p-6 shadow-sm space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-sky-200 font-bold">صافي الأرباح القابلة للسحب</span>
                    <span className="text-2xl font-black text-[#54B9F2] block font-mono">
                      {netEarnings.toLocaleString()} ر.ي
                    </span>
                  </div>

                  <button
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="w-full py-2 rounded-xl bg-[#54B9F2] text-[#172A46] font-black text-xs hover:bg-sky-400 transition"
                  >
                    طلب سحب الأرباح لحسابي البنكي 💸
                  </button>
                </div>
              </div>

              {/* Transactions History */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-black text-[#172A46]">سجل العمليات المالية والتحويلات</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#172A46] block">حوالة واردة - طلبية #1045</span>
                      <span className="text-[10px] text-slate-400">كريمي جوال • منذ يومين</span>
                    </div>
                    <span className="font-bold text-emerald-600 font-mono">+48,000 ر.ي</span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#172A46] block">حوالة واردة - طلبية #1044</span>
                      <span className="text-[10px] text-slate-400">العمقي للصرافة • منذ 3 أيام</span>
                    </div>
                    <span className="font-bold text-emerald-600 font-mono">+24,000 ر.ي</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          

          {/* TAB 7: REVIEWS & RATINGS (التقييمات والمراجعات) */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#172A46]">تقييمات ومراجعات العملاء</h3>
                  <p className="text-xs text-slate-500">
                    تفاعل مع عملائك في المكلا وقم بالرد على ملاحظاتهم لبناء الثقة
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                  <span>4.8</span>
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>

              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-[#F3F6FB]/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#172A46] text-white flex items-center justify-center font-bold text-xs">
                          {rev.customer.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#172A46]">{rev.customer}</span>
                          <span className="text-[10px] text-slate-400 block">{rev.date} • {rev.productName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pr-9">{rev.comment}</p>

                    {/* Merchant Reply if exists */}
                    {rev.reply && (
                      <div className="mr-9 p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-[#54B9F2] block">رد المتجر:</span>
                        <p className="text-slate-600">{rev.reply}</p>
                      </div>
                    )}

                    {/* Reply Input */}
                    {!rev.reply && (
                      <div className="mr-9 flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="اكتب رد المتجر للعميل..."
                          value={replyText[rev.id] || ''}
                          onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-[#54B9F2]"
                        />
                        <button
                          onClick={() => handleAddReviewReply(rev.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#172A46] text-white font-bold text-xs hover:bg-[#233f66] transition flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>إرسال</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {/* TAB 8: NOTIFICATIONS (الإشعارات) */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#172A46]">مركز التنبيهات والإشعارات</h3>
                  <p className="text-xs text-slate-500">متابعة فورية للطلبات، المبيعات، ومراجعات العملاء</p>
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-xs font-bold text-[#54B9F2] hover:underline"
                >
                  تحديد الكل كمقروء
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                      n.unread ? 'bg-sky-50/60 border-sky-200' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#172A46] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-[#54B9F2]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[#172A46]">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          

          {/* TAB 9: SETTINGS (إعدادات الحساب) */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#172A46]">إعدادات الحساب والبيانات البنكية</h3>
                <p className="text-xs text-slate-500">
                  ربط حسابات البنوك اليمنية (الكريمي، العمقي) لتحويل أرباح المبيعات تلقائياً
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">حساب بنك الكريمي (رقم الحساب أو الآيبان)</label>
                  <input
                    type="text"
                    defaultValue="30129841"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">حساب العمقي للصرافة</label>
                  <input
                    type="text"
                    defaultValue="AMQ-889021"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف لرمز التحقق (OTP)</label>
                  <input
                    type="tel"
                    defaultValue="771234567"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">تغيير كلمة المرور</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert('تم حفظ إعدادات الحساب والبيانات البنكية بنجاح!')}
                  className="px-6 py-2.5 rounded-xl bg-[#172A46] text-white font-bold hover:bg-[#233f66] transition"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}

          {/* TAB 10: FINANCES & BANK SUBSCRIPTIONS (الاشتراك والمدفوعات البنكية) */}
          {activeTab === 'finances' && (
            <div className="space-y-6">
              {/* Platform Free Month Policy Banner */}
              <div className="rounded-3xl bg-gradient-to-r from-[#172A46] to-[#1e385e] p-6 text-white shadow-xl border border-sky-900/60 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                        سياسة المنصة الرسمية
                      </span>
                      <span className="text-xs text-sky-300 font-bold">
                        اليمن • حضرموت والمكلا
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white">
                      الشهر الأول مجاني بالكامل لكافة المتاجر والأسر المنتجة
                    </h3>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                      حرصاً على دعم الحرفيين ورواد الأعمال في المكلا وحضرموت، تقدم منصة غيم سبيس شهراً تجريبياً مجانياً كاملاً لكافة الخدمات من تاريخ إطلاق المتجر، وتبدأ الاشتراكات الرمزية بعد انقضاء الشهر لضمان استمرار الدعم اللوجستي وتطوير المنصة.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedInvoiceForPayment(merchantInvoices[0] || null);
                      setIsPaymentModalOpen(true);
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg transition transform hover:scale-105 shrink-0 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>سداد / تجديد الاشتراك عبر البنوك اليمنية</span>
                  </button>
                </div>
              </div>

              {/* Subscription Status Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Active Plan & Status */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-500">حالة الاشتراك الحالية</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-black ${
                        merchantSubscription?.status === 'active_trial'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : merchantSubscription?.status === 'expiring_soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          : merchantSubscription?.status === 'active_paid'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {merchantSubscription?.status === 'active_trial' && 'شهر تجريبي مجاني نشط ☁️'}
                      {merchantSubscription?.status === 'expiring_soon' && '⚠️ يوشك الشهر المجاني على الانتهاء'}
                      {merchantSubscription?.status === 'active_paid' && 'مشترك ومسدد ✅'}
                      {merchantSubscription?.status === 'expired' && 'منتهي - يرجى السداد 🔴'}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-[#172A46]">
                      {merchantSubscription?.planName || 'باقة النمو والمتاجر المتميزة'}
                    </h4>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-[#172A46] font-mono">
                        {merchantSubscription?.price?.toLocaleString()}
                      </span>
                      <span className="text-xs text-sky-600 font-bold">ريال يمني (ر.ي) / شهرياً</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F3F6FB] border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">بداية الفترة:</span>
                      <span className="font-bold text-[#172A46]">{merchantSubscription?.trialStartDate || '2026-10-20'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">تاريخ الاستحقاق والتجديد:</span>
                      <span className="font-bold text-[#172A46] font-mono">{merchantSubscription?.currentPeriodEnd || '2026-11-19'}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 font-bold">
                      <span className="text-slate-700">المدة المتبقية:</span>
                      <span className="text-sky-600">
                        {calculateDaysRemaining(merchantSubscription?.currentPeriodEnd)} يوماً
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Dues Summary */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <span className="text-xs font-bold text-slate-500 block border-b border-slate-100 pb-3">
                    المبالغ المستحقة والمدفوعة
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                      <span className="text-[10px] text-amber-800 font-bold block">المبلغ المستحق حالياً</span>
                      <span className="text-lg font-black text-amber-900 font-mono mt-1 block">
                        {(merchantInvoices.find(i => i.status === 'pending_payment')?.amount || 0).toLocaleString()} ر.ي
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                      <span className="text-[10px] text-emerald-800 font-bold block">إجمالي ما تم سداده</span>
                      <span className="text-lg font-black text-emerald-900 font-mono mt-1 block">
                        {(merchantPayments.filter(p => p.status === 'approved').reduce((acc, p) => acc + p.amount, 0)).toLocaleString()} ر.ي
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <span className="font-bold text-[#172A46] block">طرق السداد المعتمدة في اليمن:</span>
                    <p className="text-slate-500">
                      إيداع أو تحويل عبر بنك الكريمي، شركة العمقي، شركة القطيبي، وبنك بن دول مع رفع صورة الإشعار للمطابقة والاعتماد.
                    </p>
                  </div>
                </div>

                {/* 3. Quick Action & Instructions */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 block border-b border-slate-100 pb-3">
                      إجراءات السداد
                    </span>
                    <h5 className="font-bold text-xs text-[#172A46]">كيف يتم سداد وتجديد الاشتراك؟</h5>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                      <li>اختر الفاتورة المستحقة من الجدول أدناه.</li>
                      <li>قم بالتحويل إلى أحد حسابات المنصة البنكية.</li>
                      <li>ارفع صورة إشعار أو إيصال التحويل.</li>
                      <li>تقوم الإدارة بالتدقيق وتمديد اشتراكك تلقائياً.</li>
                    </ol>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedInvoiceForPayment(merchantInvoices[0] || null);
                      setIsPaymentModalOpen(true);
                    }}
                    className="w-full py-3 rounded-2xl bg-[#172A46] hover:bg-[#233f66] text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-[#54B9F2]" />
                    <span>سداد الاشتراك الآن 💳</span>
                  </button>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#172A46]">فواتير المتجر والاشتراكات</h3>
                    <span className="text-xs text-slate-400">سجل الفواتير الصادرة وتواريخ الاستحقاق</span>
                  </div>
                  <span className="text-xs font-bold text-[#54B9F2] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                    {merchantInvoices.length} فواتير
                  </span>
                </div>

                {merchantInvoices.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400">لا توجد فواتير مستحقة حالياً</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold">
                          <th className="pb-3 pr-2">رقم الفاتورة</th>
                          <th className="pb-3">الفترة والوصف</th>
                          <th className="pb-3">الباقة</th>
                          <th className="pb-3">المبلغ</th>
                          <th className="pb-3">تاريخ الاستحقاق</th>
                          <th className="pb-3">الحالة</th>
                          <th className="pb-3 pl-2 text-center">الإجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {merchantInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 pr-2 font-mono font-bold text-[#172A46]">
                              {inv.invoiceNumber}
                            </td>
                            <td className="py-3.5 font-bold text-slate-700">
                              {inv.periodLabel}
                            </td>
                            <td className="py-3.5 text-slate-600">
                              {inv.planName}
                            </td>
                            <td className="py-3.5 font-mono font-black text-[#172A46]">
                              {inv.amount?.toLocaleString()} ر.ي
                            </td>
                            <td className="py-3.5 text-slate-500 font-mono">
                              {inv.dueDate}
                            </td>
                            <td className="py-3.5">
                              {inv.status === 'paid' && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                  مسددة بالكامل ✅
                                </span>
                              )}
                              {inv.status === 'under_review' && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                  قيد التدقيق والمراجعة ⏳
                                </span>
                              )}
                              {inv.status === 'pending_payment' && (
                                <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                                  مستحقة السداد 🔴
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 pl-2 text-center">
                              {inv.status === 'pending_payment' ? (
                                <button
                                  onClick={() => {
                                    setSelectedInvoiceForPayment(inv);
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition shadow-sm"
                                >
                                  سداد الآن 💳
                                </button>
                              ) : inv.status === 'under_review' ? (
                                <span className="text-[11px] text-amber-600 font-bold">
                                  بانتظار المشرف
                                </span>
                              ) : (
                                <span className="text-[11px] text-emerald-600 font-bold">
                                  مكتملة
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Submitted Payment Receipts History */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-[#172A46]">سجل إيصالات التحويل البنكي</h3>
                    <span className="text-xs text-slate-400">حالات تدقيق التحويلات من قبل الإدارة المالية</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {merchantPayments.length} عمليات سداد
                  </span>
                </div>

                {merchantPayments.length === 0 ? (
                  <p className="text-center py-8 text-xs text-slate-400">لم يتم رفع أي إيصالات سداد بعد</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold">
                          <th className="pb-3 pr-2">رقم العملية</th>
                          <th className="pb-3">البنك المحول إليه</th>
                          <th className="pb-3">رقم الحوالة / الإشعار</th>
                          <th className="pb-3">المبلغ</th>
                          <th className="pb-3">تاريخ الإرسال</th>
                          <th className="pb-3">صورة الإيصال</th>
                          <th className="pb-3 pl-2">حالة المراجعة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {merchantPayments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 pr-2 font-mono font-bold text-[#172A46]">
                              {pay.id}
                            </td>
                            <td className="py-3.5 font-bold text-slate-700">
                              {pay.bankName}
                            </td>
                            <td className="py-3.5 font-mono text-sky-600 font-bold">
                              {pay.transferRef}
                            </td>
                            <td className="py-3.5 font-mono font-black text-[#172A46]">
                              {pay.amount?.toLocaleString()} ر.ي
                            </td>
                            <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                              {pay.createdAt || pay.transferDate}
                            </td>
                            <td className="py-3.5">
                              {pay.receiptImage ? (
                                <a
                                  href={pay.receiptImage}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 p-1 rounded-lg border border-slate-200 hover:border-sky-400 transition"
                                  title="عرض الإيصال"
                                >
                                  <img
                                    src={pay.receiptImage}
                                    alt="الإيصال"
                                    className="w-8 h-8 rounded object-cover shadow-sm"
                                  />
                                </a>
                              ) : (
                                <span className="text-slate-400 text-[10px]">لا يوجد</span>
                              )}
                            </td>
                            <td className="py-3.5 pl-2">
                              {pay.status === 'approved' && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                  معتمد ومقبول ✅
                                </span>
                              )}
                              {pay.status === 'pending_verification' && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                  قيد التدقيق ⏳
                                </span>
                              )}
                              {pay.status === 'rejected' && (
                                <div className="space-y-0.5">
                                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                                    مرفوض ❌
                                  </span>
                                  {pay.rejectionReason && (
                                    <p className="text-[10px] text-red-600 mt-1">
                                      السبب: {pay.rejectionReason}
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: MANUAL ADD PRODUCT */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              onClick={() => setIsManualModalOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-slate-100 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-[#172A46] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#54B9F2]" />
                  <span>إضافة منتج يدوي جديد إلى المتجر</span>
                </h3>
                <button
                  onClick={() => setIsManualModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddManualProduct} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم المنتج <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: بخور مكلاوي ملكي مسقى بالعود والمسك"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      التصنيف <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                    >
                      {categories.length > 0 ? (
                        categories.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="بخور وعطور">بخور وعطور</option>
                          <option value="صناعات يدوية">صناعات يدوية</option>
                          <option value="ديكور وهدايا">ديكور وهدايا</option>
                          <option value="أسر منتجة">أسر منتجة</option>
                          <option value="ملابس وأزياء">ملابس وأزياء</option>
                          <option value="حلويات ومخبوزات">حلويات ومخبوزات</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      الكمية بالمخزون المتوفر <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.inStock}
                      onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      السعر الأساسي (ر.ي) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="24000"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono font-bold focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      السعر بعد الخصم (اختياري - ر.ي)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="اتركه فارغاً إن لم يوجد خصم"
                      value={newProduct.discountPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono focus:outline-none focus:border-[#54B9F2]"
                    />
                  </div>
                </div>

                {/* Multi-Image Upload & Preview Gallery */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    صور المنتج (متعددة - مع تحديد الصورة الرئيسية)
                  </label>
                  
                  {/* Thumbnails list */}
                  <div className="flex flex-wrap gap-2.5 mb-2.5">
                    {(newProduct.images || []).map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200 group bg-slate-100">
                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewProductImage(idx)}
                          className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow hover:bg-red-700"
                          title="حذف الصورة"
                        >
                          ✕
                        </button>
                        {newProduct.image === img ? (
                          <span className="absolute bottom-1 right-1 text-[8px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded shadow">
                            الرئيسية ⭐
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img)}
                            className="absolute bottom-1 right-1 text-[8px] bg-slate-900/80 text-white font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow"
                          >
                            تعيين كرئيسية
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Upload button & URL input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="cursor-pointer py-2 px-3 rounded-xl border border-dashed border-sky-400 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition">
                      <ImageIcon className="w-4 h-4 text-sky-600" />
                      <span>رفع صورة من الجهاز</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAddNewProductImage}
                      />
                    </label>

                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="أو ألصق رابط صورة..."
                        value={newImageUrlInput}
                        onChange={(e) => setNewImageUrlInput(e.target.value)}
                        className="flex-1 bg-[#F3F6FB] border border-slate-200 rounded-xl px-2.5 py-2 text-[11px] text-slate-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-2.5 py-2 bg-[#172A46] text-white rounded-xl text-[11px] font-bold shrink-0"
                      >
                        إضافة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Options (Sizes & Colors) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      خيارات المقاسات (مفصولة بفاصلة)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: صغير، وسط، كبير، أو 100ml"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      خيارات الألوان أو النكهات (مفصولة بفاصلة)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: أحمر، كحلي، بيج"
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="block font-bold text-slate-800">حالة ظهور المنتج في المنصة</span>
                    <span className="text-[10px] text-slate-500">
                      {newProduct.isVisible ? 'نشط ومعروض للشراء للجميع في السوق' : 'مخفي مؤقتاً كمسودة'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, isVisible: !newProduct.isVisible })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                      newProduct.isVisible
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{newProduct.isVisible ? '🟢 معروض للبيع' : '⚪ مخفي مؤقتاً'}</span>
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الوصف التسويقي للمنتج</label>
                  <textarea
                    rows={2}
                    placeholder="اكتب وصفاً جذاباً لمكونات المنتج وطريقة صنعه التراثية..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#54B9F2] text-[#172A46] font-black hover:bg-sky-400 transition shadow-md"
                  >
                    حفظ المنتج وإدراجه بالمتجر
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AI ASSISTANT PRODUCT GENERATOR */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              onClick={() => setIsAiModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100 p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#172A46]">
                    مساعد الذكاء الاصطناعي لتوليد المنتجات (AI Generator)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    اكتب فقط فكرة أو اسم منتجك، وسيقوم الذكاء الاصطناعي بكتابة العنوان والوصف والسعر المناسب
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ما هو المنتج الذي تريد بيعه؟ (اكتب بالعامية أو الفصحى):
                  </label>
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثال: بخور دقة عود مكلاوي مسقى أو شمعة لبان حوجري"
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-bold focus:outline-none focus:border-[#54B9F2]"
                  />
                </div>

                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleGenerateWithAi}
                  className="w-full py-3 rounded-xl bg-[#172A46] text-white hover:bg-[#233f66] font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Bot className="w-4 h-4 animate-spin text-[#54B9F2]" />
                      <span>الذكاء الاصطناعي يقوم بصياغة المنتج الآن...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>توليد تفاصيل المنتج بالذكاء الاصطناعي</span>
                    </>
                  )}
                </button>

                {/* AI Result Card */}
                {aiResult && (
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-bold text-[#54B9F2] uppercase tracking-wider block">
                      النتيجة المقترحة من الـ AI:
                    </span>
                    <h4 className="font-extrabold text-sm text-[#172A46]">{aiResult.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{aiResult.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-sky-200/60 font-bold text-xs">
                      <span>السعر المقترح: {aiResult.price.toLocaleString()} ر.ي</span>
                      <span>التصنيف: {aiResult.category}</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmAiProduct}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#54B9F2] to-sky-600 text-[#172A46] font-black text-xs hover:from-sky-400 hover:to-[#54B9F2] transition mt-2 shadow-sm"
                    >
                      اعتماد وإضافة المنتج فورياً إلى متجري ✅
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              onClick={() => setEditingProduct(null)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full border border-slate-100 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-[#172A46] flex items-center gap-2">
                  <Edit className="w-5 h-5 text-[#54B9F2]" />
                  <span>تعديل بيانات المنتج #{editingProduct.id}</span>
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المنتج</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">التصنيف</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الكمية بالمخزون</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingProduct.inStock ?? 10}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">السعر الأساسي (ر.ي)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">السعر بعد الخصم (اختياري)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.discountPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value })}
                      placeholder="بدون خصم"
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Multi-Image Gallery in Edit */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">صور المنتج</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(editingProduct.images || [editingProduct.image]).filter(Boolean).map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditingProductImage(idx)}
                          className="absolute top-1 left-1 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold"
                        >
                          ✕
                        </button>
                        {editingProduct.image === img && (
                          <span className="absolute bottom-0 right-0 bg-amber-400 text-slate-950 text-[8px] font-bold px-1 rounded-tl">
                            رئيسية
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <label className="cursor-pointer py-1.5 px-3 rounded-xl border border-dashed border-sky-400 bg-sky-50 text-sky-800 text-[11px] font-bold inline-flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                    <span>إضافة صورة أخرى للمنتج</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleEditProductImageUpload}
                    />
                  </label>
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="block font-bold text-slate-800">ظهور المنتج في المتجر</span>
                    <span className="text-[10px] text-slate-500">
                      {editingProduct.isVisible !== false ? 'المنتج معروض ونشط في المنصة' : 'المنتج مخفي مؤقتاً'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, isVisible: editingProduct.isVisible === false ? true : false })}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      editingProduct.isVisible !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{editingProduct.isVisible !== false ? '🟢 معروض للبيع' : '⚪ مخفي مؤقتاً'}</span>
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الوصف</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#54B9F2] text-[#172A46] font-black hover:bg-sky-400 transition shadow-md"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: WITHDRAWAL REQUEST MODAL */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              onClick={() => setIsWithdrawModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-slate-100 p-6 space-y-4">
              <h3 className="text-base font-black text-[#172A46] border-b border-slate-100 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#54B9F2]" />
                <span>طلب سحب أرباح التاجر</span>
              </h3>

              {withdrawSuccess ? (
                <div className="p-6 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-black text-[#172A46]">تم رفع طلب السحب بنجاح!</h4>
                  <p className="text-xs text-slate-500">
                    سيتم إيداع المبلغ في حسابك بـ ({withdrawBank}) خلال 24 ساعة عمل.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawalSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المبلغ المراد سحبه (ر.ي)</label>
                    <input
                      type="number"
                      required
                      max={netEarnings}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">البنك / محفظة الاستلام</label>
                    <select
                      value={withdrawBank}
                      onChange={(e) => setWithdrawBank(e.target.value)}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800"
                    >
                      <option value="الكريمي">بنك الكريمي للتمويل الأصغر الإسلامي</option>
                      <option value="العمقي">شركة العمقي وإخوانه للصرافة</option>
                      <option value="القطيبي">بنك القطيبي الإسلامي</option>
                      <option value="بن دول">شركة بن دول للصرافة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رقم الحساب / الآيبان</label>
                    <input
                      type="text"
                      required
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-mono"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWithdrawModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 font-bold"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#54B9F2] text-[#172A46] font-black hover:bg-sky-400 transition"
                    >
                      تأكيد طلب السحب
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      {/* MODAL 5: BANK TRANSFER PAYMENT MODAL */}
      <MerchantPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={selectedInvoiceForPayment}
      />
    </div>
  );
}
