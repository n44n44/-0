import React, { useState } from 'react';
import {
  ShieldCheck,
  Store,
  DollarSign,
  TrendingUp,
  Users,
  Truck,
  Database,
  UserCheck,
  EyeOff,
  CheckCircle2,
  Package,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  Settings,
  Bell,
  Sparkles,
  ExternalLink,
  Percent,
  Sliders,
  LogOut,
  MapPin,
  Bike,
  Check,
  CreditCard,
  Building2,
  Eye,
  XCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  FileText,
  Tag,
  Clock,
  Calendar,
  Ticket,
  UserX,
  Copy,
  Send,
  Menu,
  X,
  Share2,
  Award,
  ChevronDown,
  LayoutDashboard,
  Shield,
  Layers,
  Phone,
  ShoppingBag,
} from 'lucide-react';
import GhaymLogo from '../components/GhaymLogo';
import AdminReceiptReviewModal from '../components/AdminReceiptReviewModal';
import YemeniPhoneInput from '../components/YemeniPhoneInput';
import { validateYemeniPhone, cleanYemeniPhone } from '../utils/phoneValidation';
import { usePlatform, calculateDaysRemaining } from '../context/PlatformContext';

export default function AdminDashboard({ onBackToMarket, onOpenSupabaseModal }) {
  const {
    db,
    isSupabaseConnected,
    logoutAdmin,
    stores = [],
    toggleStoreVerification,
    orders = [],
    products = [],
    subscriptionPlans = [],
    subscriptions = [],
    adminUpdateSubscriptionPlan,
    adminAddSubscriptionPlan,
    adminDeleteSubscriptionPlan,
    invoices = [],
    payments = [],
    platformBankAccounts = [],
    adminApprovePayment,
    adminRejectPayment,
    adminCreateInvoice,
    adminUpdateBankAccount,
    adminAddBankAccount,
    adminToggleBankAccount,
    courierProfile,
    auditLogs = [],
    allUsers = [],

    // Categories
    categories = [],
    adminAddCategory,
    adminUpdateCategory,
    adminDeleteCategory,

    // Merchants & Requests
    merchantsList = [],
    merchantRequests = [],
    submitMerchantRequest,
    adminApproveMerchantRequest,
    adminRejectMerchantRequest,
    adminApproveMerchant,
    adminRejectMerchant,
    adminAddMerchant,
    adminUpdateMerchant,
    adminToggleMerchantStatus,
    adminDeleteMerchant,

    // Couriers & Invites
    couriersList = [],
    deliveryInvites = [],
    adminCreateDeliveryInvite,
    adminRevokeDeliveryInvite,
    adminAddCourier,
    adminUpdateCourier,
    adminToggleCourierStatus,
    adminDeleteCourier,

    // Stores & Products
    adminAddStore,
    adminUpdateStore,
    adminDeleteStore,
    adminToggleStoreStatus,
    adminUpdateProduct,
    adminDeleteProduct,
    adminToggleProductVisibility,

    // Customers
    customerUser,
    adminUpdateCustomer,
    adminToggleCustomerStatus,
    adminDeleteCustomer,
    adminToggleUserStatus,

    // Orders
    adminUpdateOrderStatus,
    adminAssignOrderCourier,

    // Clean Production Mode
    isProductionMode,
    getDemoDataSummary,
    resetToCleanProductionMode,
    restoreDemoData,
    adminAddLog,
  } = usePlatform();

  // Active Tab: 8 core sections as requested by the user + configuration tabs
  // 'overview' | 'merchants' | 'couriers' | 'customers' | 'stores' | 'products' | 'orders' | 'roles'
  // Secondary: 'subscriptions' | 'categories' | 'database-control' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [merchantSubTab, setMerchantSubTab] = useState('requests'); // 'requests' | 'active'
  const [courierSubTab, setCourierSubTab] = useState('invites'); // 'invites' | 'active'

  // Invite Generator Form State
  const [inviteForm, setInviteForm] = useState({
    recipientName: '',
    recipientPhone: '',
    vehicleType: 'دراجة نارية (سكوتر)',
    city: 'المكلا',
    expiresInDays: 7,
    notes: '',
  });
  const [generatedInviteAlert, setGeneratedInviteAlert] = useState(null);

  // Subscriptions & Finances Sub-tab
  const [subFinanceTab, setSubFinanceTab] = useState('receipts'); // 'receipts' | 'invoices' | 'plans' | 'banks'
  const [selectedPaymentForReview, setSelectedPaymentForReview] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    storeId: stores[0]?.id || 'store-1',
    planName: 'باقة النمو والمتاجر المتميزة',
    amount: 25000,
    dueDate: '2026-11-25',
    periodLabel: 'اشتراك شهر ديسمبر 2026',
    notes: 'فاتورة تجديد الاشتراك الشهري',
  });

  // Editing Plans and Banks
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({});
  const [editingBankId, setEditingBankId] = useState(null);
  const [bankForm, setBankForm] = useState({});

  // Add Modals
  const [isAddMerchantModalOpen, setIsAddMerchantModalOpen] = useState(false);
  const [isAddCourierModalOpen, setIsAddCourierModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({ name: '', description: '', icon: 'tag' });
  const [newCourierForm, setNewCourierForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'المكلا',
    vehicleType: 'دراجة نارية',
    plateNumber: '',
  });
  const [adminEditingProduct, setAdminEditingProduct] = useState(null);

  // Financial Settings State
  const [commissionRate, setCommissionRate] = useState(5);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(1200);

  // Data Calculations for the 8 Core Overview Metrics
  const customersList = (db?.users || []).filter((u) => u.role === 'customer' || !u.role);
  const activeMerchantsList = (db?.users || []).filter((u) => u.role === 'merchant');
  const pendingRequestsList = (db?.merchantRequests || []).filter((r) => r.status === 'pending');
  const approvedRequestsList = (db?.merchantRequests || []).filter((r) => r.status === 'approved');
  const rejectedRequestsList = (db?.merchantRequests || []).filter((r) => r.status === 'rejected');
  const activeCouriersList = (db?.users || []).filter((u) => u.role === 'courier');
  const newOrdersList = orders.filter((o) => o.status === 'pending' || o.status === 'ready_for_pickup');
  const totalMarketGmv = orders.reduce((acc, o) => acc + (o.total || 0), 0) + 1845000;
  const platformRevenue = Math.round(totalMarketGmv * (commissionRate / 100));

  const pendingPayments = (payments || []).filter((p) => p.status === 'pending_verification');
  const demoSummary = getDemoDataSummary ? getDemoDataSummary() : {};

  // Handle Courier Invite Generation
  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.recipientName.trim() || !inviteForm.recipientPhone.trim()) {
      alert('يرجى كتابة اسم المندوب ورقم هاتفه');
      return;
    }
    const cleanPhone = cleanYemeniPhone(inviteForm.recipientPhone);
    const newInv = await adminCreateDeliveryInvite({
      recipientName: inviteForm.recipientName.trim(),
      recipientPhone: cleanPhone,
      vehicleType: inviteForm.vehicleType,
      city: inviteForm.city,
      expiresInDays: Number(inviteForm.expiresInDays) || 7,
      notes: inviteForm.notes,
    });
    setGeneratedInviteAlert(newInv);
    setInviteForm({
      recipientName: '',
      recipientPhone: '',
      vehicleType: 'دراجة نارية (سكوتر)',
      city: 'المكلا',
      expiresInDays: 7,
      notes: '',
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`تم نسخ الكود: ${text}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col md:flex-row text-[#07132B]" dir="rtl">
      {/* ================= MOBILE TOP BAR & DRAWER ================= */}
      <div className="md:hidden bg-[#07132B] text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-[#1c325c]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="القائمة الجانبية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <GhaymLogo size="sm" subtitle="لوحة الإدارة" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
            {isProductionMode ? 'إنتاج حقيقي' : 'نموذجي'}
          </span>
        </div>
      </div>

      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside
        className={`fixed md:static inset-y-0 right-0 z-40 w-64 md:w-68 bg-[#07132B] text-white flex flex-col justify-between shrink-0 shadow-2xl border-l border-[#1c325c] transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Logo Header */}
          <div className="p-5 border-b border-[#1c325c] flex items-center justify-between">
            <GhaymLogo size="md" subtitle="Super Admin Panel" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg bg-white/10 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-2.5 bg-[#0a1b3b] text-[11px] text-[#38BDF8] font-bold flex items-center gap-1.5 border-b border-[#1c325c]">
            <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
            <span>منظومة التحكم والإشراف العام</span>
          </div>

          {/* Primary 8 Admin Navigation Tabs */}
          <div className="px-3 pt-3 pb-1 text-[10px] font-black tracking-wider text-slate-400 uppercase">
            الأقسام الرئيسية
          </div>

          <nav className="p-2 space-y-1 text-xs font-bold">
            {/* 1. الرئيسية (Overview) */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>الرئيسية (لوحة المؤشرات)</span>
              </div>
            </button>

            {/* 2. إدارة التجار (Merchants) */}
            <button
              onClick={() => {
                setActiveTab('merchants');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'merchants'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4" />
                <span>إدارة التجار ({activeMerchantsList.length})</span>
              </div>
              {pendingRequestsList.length > 0 && (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                  {pendingRequestsList.length} طلب
                </span>
              )}
            </button>

            {/* 3. إدارة المندوبين (Couriers) */}
            <button
              onClick={() => {
                setActiveTab('couriers');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'couriers'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>إدارة المندوبين ({activeCouriersList.length})</span>
              </div>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded-full">
                دعوات
              </span>
            </button>

            {/* 4. إدارة العملاء (Customers) */}
            <button
              onClick={() => {
                setActiveTab('customers');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>إدارة العملاء ({customersList.length})</span>
              </div>
            </button>

            {/* 5. إدارة المتاجر (Stores) */}
            <button
              onClick={() => {
                setActiveTab('stores');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'stores'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4" />
                <span>إدارة المتاجر ({stores.length})</span>
              </div>
            </button>

            {/* 6. إدارة المنتجات (Products) */}
            <button
              onClick={() => {
                setActiveTab('products');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>إدارة المنتجات ({products.length})</span>
              </div>
            </button>

            {/* 7. إدارة الطلبات (Orders) */}
            <button
              onClick={() => {
                setActiveTab('orders');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>إدارة الطلبات ({orders.length})</span>
              </div>
              {newOrdersList.length > 0 && (
                <span className="text-[10px] bg-sky-500 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  {newOrdersList.length} جديد
                </span>
              )}
            </button>

            {/* 8. إدارة الصلاحيات (Roles & RBAC) */}
            <button
              onClick={() => {
                setActiveTab('roles');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-[#38BDF8] text-[#07132B] shadow-lg shadow-sky-500/20 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4" />
                <span>إدارة الصلاحيات والأمان</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
                RLS
              </span>
            </button>

            {/* Secondary Tools Header */}
            <div className="px-2 pt-3 pb-1 text-[10px] font-black tracking-wider text-slate-400 uppercase">
              الخدمات المساندة والفوترة
            </div>

            {/* Subscriptions & Bank Finances */}
            <button
              onClick={() => {
                setActiveTab('subscriptions');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'subscriptions'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span>الاشتراكات والتحويلات</span>
              </div>
              {pendingPayments.length > 0 && (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                  {pendingPayments.length}
                </span>
              )}
            </button>

            {/* Categories */}
            <button
              onClick={() => {
                setActiveTab('categories');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <Tag className="w-4 h-4 text-sky-400" />
              <span>إدارة التصنيفات ({categories.length})</span>
            </button>

            {/* Database & Cloud Supabase Control */}
            <button
              onClick={() => {
                setActiveTab('database-control');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl transition text-right cursor-pointer ${
                activeTab === 'database-control'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'text-emerald-400 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>وضع الإنتاج وقاعدة البيانات</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1c325c] space-y-2">
          {onBackToMarket && (
            <button
              onClick={onBackToMarket}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-bold transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>العودة لواجهة السوق</span>
            </button>
          )}

          <button
            onClick={() => {
              if (logoutAdmin) logoutAdmin();
              if (onBackToMarket) onBackToMarket();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-red-300 hover:bg-red-500/10 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ================= MAIN CONTENT VIEWPORT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Sticky Header */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between shadow-xs sticky top-0 z-30">
          <div>
            <h1 className="text-base font-black text-[#07132B]">
              لوحة تحكم المشرف العام — منصة غيم سبيس
            </h1>
            <span className="text-xs text-slate-500">
              إدارة التجار، المندوبين، العملاء، مراقبة الطلبات وتأمين الصلاحيات (حضرموت والمكلا)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{isSupabaseConnected ? 'سحابة Supabase متصلة' : 'بيئة تشغيل محلية نشطة'}</span>
            </div>
            {onOpenSupabaseModal && (
              <button
                onClick={onOpenSupabaseModal}
                className="px-3 py-1.5 rounded-xl bg-[#07132B] hover:bg-[#122347] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-sky-400" />
                <span>إعدادات السحابة</span>
              </button>
            )}
          </div>
        </header>

        {/* Viewport Workspace */}
        <div className="p-4 sm:p-6 space-y-6">

          {/* ======================================================== */}
          {/* 1. OVERVIEW (الرئيسية) - 8 METRICS & VISUAL ANALYTICS */}
          {/* ======================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome & System Status Banner */}
              <div className="bg-gradient-to-r from-[#07132B] via-[#0e2452] to-[#07132B] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-sky-500/20 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                      <span>نظام الإدارة المتكامل — إصدار 2026</span>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      مرحبًا بك في مركز قيادة غيم سبيس ☁️
                    </h2>
                    <p className="text-xs text-sky-200 mt-1 max-w-xl leading-relaxed">
                      نظام إدارة شامل ومحمي بضوابط الصلاحيات RBAC لمتابعة كافة الأنشطة التجارية والتوصيل في ساحل ووادي حضرموت.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveTab('merchants')}
                      className="px-4 py-2 rounded-xl bg-[#38BDF8] text-[#07132B] font-black text-xs transition shadow-md hover:brightness-105 cursor-pointer"
                    >
                      مراجعة طلبات التجار ({pendingRequestsList.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('couriers')}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 cursor-pointer"
                    >
                      توليد كود دعوة مندوب 🛵
                    </button>
                  </div>
                </div>
              </div>

              {/* THE 8 CORE REQUIRED STAT CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* 1. إجمالي العملاء */}
                <div
                  onClick={() => setActiveTab('customers')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">1. إجمالي العملاء</span>
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {customersList.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">حسابات نشطة فورياً</span>
                </div>

                {/* 2. إجمالي التجار */}
                <div
                  onClick={() => setActiveTab('merchants')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">2. إجمالي التجار</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                      <Store className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {activeMerchantsList.length}
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold block mt-1">تجار معتمدون</span>
                </div>

                {/* 3. إجمالي المتاجر */}
                <div
                  onClick={() => setActiveTab('stores')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">3. إجمالي المتاجر</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {stores.length}
                  </span>
                  <span className="text-[11px] text-blue-600 font-bold block mt-1">
                    {stores.filter((s) => s.verified).length} متجر موثق معتمد
                  </span>
                </div>

                {/* 4. إجمالي المنتجات */}
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">4. إجمالي المنتجات</span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {products.length}
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold block mt-1">منتج معروض بالسوق</span>
                </div>

                {/* 5. إجمالي الطلبات */}
                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">5. إجمالي الطلبات</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {orders.length}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold block mt-1">طلبية مسجلة</span>
                </div>

                {/* 6. عدد المندوبين */}
                <div
                  onClick={() => setActiveTab('couriers')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">6. عدد المندوبين</span>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {activeCouriersList.length}
                  </span>
                  <span className="text-[11px] text-purple-600 font-bold block mt-1">أسطول التوصيل بالمكلا</span>
                </div>

                {/* 7. الطلبات الجديدة */}
                <div
                  onClick={() => setActiveTab('orders')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-sky-400 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">7. الطلبات الجديدة</span>
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#07132B] flex items-center justify-center group-hover:scale-105 transition">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="text-2xl font-black text-[#07132B] mt-2 block font-mono">
                    {newOrdersList.length}
                  </span>
                  <span className="text-[11px] text-sky-700 font-bold block mt-1">قيد المراجعة والتجهيز</span>
                </div>

                {/* 8. طلبات انضمام التجار المعلقة */}
                <div
                  onClick={() => setActiveTab('merchants')}
                  className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-xs hover:border-amber-500 transition cursor-pointer group bg-amber-50/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-900 font-bold">8. طلبات التجار المعلقة</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center group-hover:scale-105 transition font-black">
                      {pendingRequestsList.length}
                    </div>
                  </div>
                  <span className="text-2xl font-black text-amber-900 mt-2 block font-mono">
                    {pendingRequestsList.length}
                  </span>
                  <span className="text-[11px] text-amber-700 font-bold block mt-1">بانتظار قرار الإدارة</span>
                </div>
              </div>

              {/* VISUAL CHARTS & ANALYTICS BREAKDOWN */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders Distribution Visual Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-[#07132B]">توزيع دورة حياة الطلبات (Orders Analytics)</h3>
                      <p className="text-xs text-slate-500">مراقبة حالات الطلبات وتدفق الشحنات من المتاجر إلى المندوبين</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                      إجمالي {orders.length} طلب
                    </span>
                  </div>

                  {/* Visual Progress Bar Chart */}
                  <div className="space-y-3.5 pt-2">
                    {/* Status 1: Pending */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-amber-700">قيد المراجعة والتأكيد ⏳</span>
                        <span className="font-mono text-slate-600">
                          {orders.filter((o) => o.status === 'pending').length} طلب
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{
                            width: `${orders.length ? Math.max(10, (orders.filter((o) => o.status === 'pending').length / orders.length) * 100) : 10}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status 2: Ready for Pickup */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-sky-700">جاهز للاستلام والتغليف 📦</span>
                        <span className="font-mono text-slate-600">
                          {orders.filter((o) => o.status === 'ready_for_pickup').length} طلب
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${orders.length ? Math.max(15, (orders.filter((o) => o.status === 'ready_for_pickup').length / orders.length) * 100) : 15}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status 3: On the way / With Courier */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-purple-700">مع كابتن التوصيل في الطريق 🛵</span>
                        <span className="font-mono text-slate-600">
                          {orders.filter((o) => o.status === 'on_the_way' || o.status === 'accepted').length} طلب
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${orders.length ? Math.max(20, (orders.filter((o) => o.status === 'on_the_way' || o.status === 'accepted').length / orders.length) * 100) : 20}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Status 4: Delivered */}
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-emerald-700">تم التسليم بنجاح للعميل ✅</span>
                        <span className="font-mono text-slate-600">
                          {orders.filter((o) => o.status === 'delivered').length} طلب
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${orders.length ? Math.max(40, (orders.filter((o) => o.status === 'delivered').length / orders.length) * 100) : 40}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics Summary */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[11px] text-slate-500 font-bold block">إجمالي مبيعات السوق (GMV)</span>
                      <span className="text-base font-black text-[#07132B] mt-0.5 block font-mono">
                        {totalMarketGmv.toLocaleString()} ر.ي
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                      <span className="text-[11px] text-emerald-800 font-bold block">صافي أرباح المنصة ({commissionRate}%)</span>
                      <span className="text-base font-black text-emerald-900 mt-0.5 block font-mono">
                        {platformRevenue.toLocaleString()} ر.ي
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Shortcuts & Pending Alerts Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#07132B] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>إجراءات إدارية سريعة</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      مهام تتطلب اتخاذ قرار سريع من المشرف
                    </p>

                    <div className="space-y-2.5 mt-4">
                      {/* Action 1: Pending Merchant Requests */}
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-amber-950 block">طلبات انضمام تجار</span>
                          <span className="text-[11px] text-amber-800">{pendingRequestsList.length} طلب بانتظار القرار</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('merchants');
                            setMerchantSubTab('requests');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition cursor-pointer"
                        >
                          معاينة
                        </button>
                      </div>

                      {/* Action 2: Courier Single-Use Invite */}
                      <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-purple-950 block">دعوة مندوب جديد</span>
                          <span className="text-[11px] text-purple-800">توليد كود دعوة فريد 🛵</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('couriers');
                            setCourierSubTab('invites');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          إنشاء كود
                        </button>
                      </div>

                      {/* Action 3: Banking Transfer Receipts */}
                      <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sky-950 block">إيصالات التحويل البنكي</span>
                          <span className="text-[11px] text-sky-800">{pendingPayments.length} إيصال بانتظار التحقق</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab('subscriptions');
                            setSubFinanceTab('receipts');
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] transition cursor-pointer"
                        >
                          مطابقة
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-slate-400 font-bold">
                      النظام محمي ومقيد بصلاحيات المدير العام 🛡️
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. MERCHANTS MANAGEMENT (إدارة التجار وطلبات الانضمام) */}
          {/* ======================================================== */}
          {activeTab === 'merchants' && (
            <div className="space-y-6">
              {/* Header with Sub-tabs */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-600" />
                    <span>إدارة التجار وطلبات فتح المتاجر الجديدة</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    مراجعة طلبات الانضمام، تدقيق البيانات، الموافقة والرفض، وإدارة وتفعيل حسابات التجار المعتمدين
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMerchantSubTab('requests')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      merchantSubTab === 'requests'
                        ? 'bg-[#07132B] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>طلبات الانضمام</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                      {pendingRequestsList.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setMerchantSubTab('active')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      merchantSubTab === 'active'
                        ? 'bg-[#07132B] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>التجار المعتمدون ({activeMerchantsList.length})</span>
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: PENDING & PROCESSED JOIN REQUESTS */}
              {merchantSubTab === 'requests' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#07132B]">طلبات الانضمام الواردة (Merchant Requests)</h3>
                      <p className="text-xs text-slate-500">لا يتم تفعيل المتجر أو حساب التاجر إلا بعد اعتماد الإدارة</p>
                    </div>
                  </div>

                  {(db?.merchantRequests || []).length === 0 ? (
                    <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                      لا توجد طلبات انضمام حالياً
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-500 font-bold">
                            <th className="pb-3 px-3">التاجر والمتجر</th>
                            <th className="pb-3 px-3">رقم الهاتف اليمني</th>
                            <th className="pb-3 px-3">النشاط والمدينة</th>
                            <th className="pb-3 px-3">نبذة / ملاحظات التاجر</th>
                            <th className="pb-3 px-3">الحالة</th>
                            <th className="pb-3 px-3 text-center">الإجراء والقرار</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(db?.merchantRequests || []).map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-3">
                                <h4 className="font-bold text-[#07132B]">{req.storeName}</h4>
                                <span className="text-[11px] text-slate-500">المالك: {req.fullName}</span>
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                                +967 {req.phone}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 font-bold text-[10px]">
                                  {req.activityType || 'متجر منوع'}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {req.city} {req.neighborhood ? `- ${req.neighborhood}` : ''}
                                </span>
                              </td>
                              <td className="py-3 px-3 max-w-xs text-slate-600 text-[11px] truncate">
                                {req.notes || '—'}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    req.status === 'approved'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : req.status === 'rejected'
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                  }`}
                                >
                                  {req.status === 'approved'
                                    ? 'معتمد ومفعل ✅'
                                    : req.status === 'rejected'
                                    ? 'مرفوض ❌'
                                    : 'قيد المراجعة ⏳'}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                {req.status === 'pending' ? (
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={async () => {
                                        await adminApproveMerchantRequest(req.id);
                                        alert(`تم قبول طلب التاجر "${req.fullName}" وتفعيل متجره "${req.storeName}" بنجاح! ✨`);
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                                    >
                                      قبول وتفعيل ✅
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const reason = prompt('سبب رفض الطلب:', 'البيانات غير مكتملة أو النشاط غير متوافق مع الشروط');
                                        if (reason) {
                                          await adminRejectMerchantRequest(req.id, reason);
                                          alert('تم تسجيل رفض الطلب');
                                        }
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition border border-red-200 cursor-pointer"
                                    >
                                      رفض ❌
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400">تم اتخاذ القرار</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-VIEW 2: ACTIVE MERCHANTS & STORE DRILLDOWN */}
              {merchantSubTab === 'active' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-[#07132B]">التجار المعتمدون في المنصة ({activeMerchantsList.length})</h3>
                      <p className="text-xs text-slate-500">إدارة الحسابات، تفعيل أو إيقاف التاجر، ومتابعة مبيعات كل متجر</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-bold">
                          <th className="pb-3 px-3">التاجر</th>
                          <th className="pb-3 px-3">اسم المتجر</th>
                          <th className="pb-3 px-3">رقم الهاتف</th>
                          <th className="pb-3 px-3">المدينة</th>
                          <th className="pb-3 px-3">حالة الحساب</th>
                          <th className="pb-3 px-3 text-center">التحكم في التفعيل</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeMerchantsList.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-bold text-[#07132B]">{m.name}</td>
                            <td className="py-3 px-3 font-bold text-sky-800">{m.storeName || 'متجر معتمد'}</td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                              +967 {m.phone}
                            </td>
                            <td className="py-3 px-3 text-slate-600">{m.city || 'المكلا'}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  m.status === 'suspended'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {m.status === 'suspended' ? 'موقوف مؤقتاً ⛔' : 'نشط ومعتمد 🟢'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => adminToggleUserStatus(m.id)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  m.status === 'suspended'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {m.status === 'suspended' ? 'إعادة التفعيل 🟢' : 'إيقاف الحساب ⛔'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. COURIERS MANAGEMENT & INVITE GENERATOR (إدارة المندوبين) */}
          {/* ======================================================== */}
          {activeTab === 'couriers' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <span>إدارة مناديب التوصيل ونظام الدعوات المعتمدة (Invites)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    لا يوجد تسجيل مفتوح للمندوبين — يتم الانضمام فقط عبر كود دعوة فريد ينشئه المشرف
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCourierSubTab('invites')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      courierSubTab === 'invites'
                        ? 'bg-[#07132B] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    أكواد الدعوة ({deliveryInvites.length})
                  </button>
                  <button
                    onClick={() => setCourierSubTab('active')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      courierSubTab === 'active'
                        ? 'bg-[#07132B] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    المناديب النشطون ({activeCouriersList.length})
                  </button>
                </div>
              </div>

              {/* SINGLE-USE INVITE GENERATOR CARD */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#07132B] text-white rounded-3xl p-6 shadow-xl border border-purple-400/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black">إنشاء كود دعوة مندوب فريد (Single-Use Invite Code)</h3>
                      <p className="text-xs text-purple-200">
                        كود رقمي مخصص للاستخدام لمرة واحدة فقط لتقييد تسجيل المناديب وضمان المصداقية
                      </p>
                    </div>
                  </div>
                </div>

                {/* Generated Invite Alert (when created) */}
                {generatedInviteAlert && (
                  <div className="p-4 rounded-2xl bg-purple-100 text-purple-950 border border-purple-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                    <div>
                      <span className="text-xs font-bold block">تم إنشاء كود الدعوة بنجاح لـ: {generatedInviteAlert.recipientName}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-mono font-black text-purple-900 tracking-wider">
                          {generatedInviteAlert.code}
                        </span>
                        <span className="text-xs text-purple-700">
                          (صالح حتى: {new Date(generatedInviteAlert.expiresAt).toLocaleDateString('ar-YE')})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(generatedInviteAlert.code)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer hover:bg-purple-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ الكود</span>
                      </button>
                      <a
                        href={`https://wa.me/967${generatedInviteAlert.recipientPhone}?text=${encodeURIComponent(
                          `مرحباً كابتن ${generatedInviteAlert.recipientName}، تم إنشاء كود دعوة خاص بك للانضمام لأسطول غيم سبيس بالمكلا:\nكود الدعوة: ${generatedInviteAlert.code}\nرابط التسجيل: ${window.location.origin}/#/login`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1 hover:bg-emerald-700"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال واتساب</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Generator Form */}
                <form onSubmit={handleGenerateInvite} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-purple-200 mb-1">اسم المندوب المرشح *</label>
                    <input
                      type="text"
                      required
                      value={inviteForm.recipientName}
                      onChange={(e) => setInviteForm({ ...inviteForm, recipientName: e.target.value })}
                      placeholder="مثال: سعيد صالح بوعيران"
                      className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-purple-300/50 outline-none focus:border-purple-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-200 mb-1">رقم الهاتف اليمني *</label>
                    <input
                      type="text"
                      required
                      value={inviteForm.recipientPhone}
                      onChange={(e) => setInviteForm({ ...inviteForm, recipientPhone: e.target.value })}
                      placeholder="771234567"
                      dir="ltr"
                      className="w-full bg-white/10 border border-purple-400/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-purple-300/50 outline-none focus:border-purple-300 text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-200 mb-1">نوع المركبة</label>
                    <select
                      value={inviteForm.vehicleType}
                      onChange={(e) => setInviteForm({ ...inviteForm, vehicleType: e.target.value })}
                      className="w-full bg-[#1e204c] border border-purple-400/30 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="دراجة نارية (سكوتر)">دراجة نارية (سكوتر)</option>
                      <option value="دراجة نارية سريعة">دراجة نارية سريعة</option>
                      <option value="سيارة نقل خفيف">سيارة نقل خفيف</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-purple-200 mb-1">صلاحية الدعوة (أيام)</label>
                    <select
                      value={inviteForm.expiresInDays}
                      onChange={(e) => setInviteForm({ ...inviteForm, expiresInDays: Number(e.target.value) })}
                      className="w-full bg-[#1e204c] border border-purple-400/30 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value={3}>3 أيام</option>
                      <option value={7}>7 أيام (أسبوع)</option>
                      <option value={14}>14 يوماً (أسبوعين)</option>
                      <option value={30}>30 يوماً (شهر)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full h-9 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>توليد كود الدعوة ⚡</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* COURIER INVITES TABLE */}
              {courierSubTab === 'invites' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#07132B]">سجل أكواد الدعوة المنشأة ({deliveryInvites.length})</h3>
                      <p className="text-xs text-slate-500">متابعة حالة كل كود دعوة (نشط، مستخدم، أو ملغي) وتاريخ انتهائه</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-bold">
                          <th className="pb-3 px-3">رمز الدعوة (Code)</th>
                          <th className="pb-3 px-3">المندوب الموجه له</th>
                          <th className="pb-3 px-3">الهاتف والمركبة</th>
                          <th className="pb-3 px-3">تاريخ الانتهاء</th>
                          <th className="pb-3 px-3">الحالة</th>
                          <th className="pb-3 px-3 text-center">الإجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {deliveryInvites.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs">
                                  {inv.code}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(inv.code)}
                                  className="text-slate-400 hover:text-purple-600 transition p-1"
                                  title="نسخ"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                            <td className="py-3 px-3 font-bold text-[#07132B]">{inv.recipientName}</td>

                            <td className="py-3 px-3">
                              <span className="font-mono text-slate-700 block" dir="ltr">+967 {inv.recipientPhone}</span>
                              <span className="text-[10px] text-slate-400">{inv.vehicleType}</span>
                            </td>

                            <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                              {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString('ar-YE') : '—'}
                            </td>

                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                  inv.status === 'used'
                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                    : inv.status === 'revoked'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {inv.status === 'used'
                                  ? 'تم استخدامه ✅'
                                  : inv.status === 'revoked'
                                  ? 'ملغي ❌'
                                  : 'نشط وصالح 🟢'}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              {inv.status === 'active' ? (
                                <button
                                  onClick={() => {
                                    if (confirm(`هل أنت متأكد من إلغاء كود الدعوة "${inv.code}"؟`)) {
                                      adminRevokeDeliveryInvite(inv.id);
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition border border-red-200 cursor-pointer"
                                >
                                  إلغاء الكود
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">مكتمل</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ACTIVE COURIERS TABLE */}
              {courierSubTab === 'active' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-[#07132B]">مناديب التوصيل المسجلون في المنصة ({activeCouriersList.length})</h3>
                      <p className="text-xs text-slate-500">تفعيل أو إيقاف المندوب، متابعة عدد الشحنات المنجزة وتقييم الأداء</p>
                    </div>

                    <button
                      onClick={() => setIsAddCourierModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#07132B] hover:bg-[#122347] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-sky-400" />
                      <span>إضافة مندوب يدوي</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-bold">
                          <th className="pb-3 px-3">المندوب</th>
                          <th className="pb-3 px-3">الهاتف</th>
                          <th className="pb-3 px-3">المركبة واللوحة</th>
                          <th className="pb-3 px-3">الشحنات المنجزة</th>
                          <th className="pb-3 px-3">التقييم</th>
                          <th className="pb-3 px-3">حالة الحساب</th>
                          <th className="pb-3 px-3 text-center">التحكم</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeCouriersList.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-bold text-[#07132B]">{c.name}</td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                              +967 {c.phone}
                            </td>
                            <td className="py-3 px-3">
                              <span className="block text-slate-800 font-medium">{c.vehicle || 'دراجة نارية'}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{c.plateNumber || 'حضرموت'}</span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800">
                              {c.totalDeliveries || 0} شحنة
                            </td>
                            <td className="py-3 px-3 font-bold text-amber-500">
                              ⭐ {c.rating || 4.9}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  c.status === 'suspended'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {c.status === 'suspended' ? 'موقوف مؤقتاً ⛔' : 'نشط 🟢'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                onClick={() => adminToggleUserStatus(c.id)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  c.status === 'suspended'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {c.status === 'suspended' ? 'إعادة تفعيل 🟢' : 'إيقاف المندوب ⛔'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. CUSTOMERS MANAGEMENT (إدارة العملاء) */}
          {/* ======================================================== */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <Users className="w-5 h-5 text-sky-600" />
                    <span>إدارة العملاء المسجلين ({customersList.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    البحث عن العملاء، فحص بيانات الحساب وعناوين التوصيل، وتفعيل أو إيقاف الحسابات
                  </p>
                </div>

                <div className="w-full sm:w-72 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث بالاسم أو رقم الهاتف أو المدينة..."
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 outline-none focus:border-sky-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="pb-3 px-3">العميل</th>
                      <th className="pb-3 px-3">رقم الهاتف</th>
                      <th className="pb-3 px-3">البريد الإلكتروني</th>
                      <th className="pb-3 px-3">المدينة والحي</th>
                      <th className="pb-3 px-3">عناوين التوصيل</th>
                      <th className="pb-3 px-3">الحالة</th>
                      <th className="pb-3 px-3 text-center">التحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customersList
                      .filter(
                        (c) =>
                          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.phone?.includes(searchTerm) ||
                          c.city?.includes(searchTerm)
                      )
                      .map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                                {cust.name?.charAt(0) || 'ع'}
                              </div>
                              <span className="font-bold text-[#07132B]">{cust.name}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                            +967 {cust.phone}
                          </td>

                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                            {cust.email || '—'}
                          </td>

                          <td className="py-3 px-3 text-slate-700">
                            {cust.city || 'المكلا'} {cust.neighborhood ? `- ${cust.neighborhood}` : ''}
                          </td>

                          <td className="py-3 px-3 text-[11px] text-slate-500">
                            {cust.addresses?.length ? `${cust.addresses.length} عنوان مسجل` : 'عنوان رئيسي'}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                cust.status === 'suspended'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {cust.status === 'suspended' ? 'موقوف ⛔' : 'نشط 🟢'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => adminToggleUserStatus(cust.id)}
                              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                cust.status === 'suspended'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {cust.status === 'suspended' ? 'تفعيل الحساب' : 'إيقاف الحساب'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 5. STORES MANAGEMENT (إدارة المتاجر وتوثيقها) */}
          {/* ======================================================== */}
          {activeTab === 'stores' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span>إدارة وتوثيق متاجر المنصة ({stores.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    منح أو إلغاء شارة "موثق معتمد" لضمان جودة الأسر المنتجة ومتابعة حالة كل متجر
                  </p>
                </div>

                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن متجر بالاسم أو المدينة..."
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 outline-none focus:border-sky-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="pb-3 px-3">المتجر</th>
                      <th className="pb-3 px-3">المدينة والحي</th>
                      <th className="pb-3 px-3">التصنيف</th>
                      <th className="pb-3 px-3">التقييم</th>
                      <th className="pb-3 px-3">حالة التوثيق</th>
                      <th className="pb-3 px-3">حالة المتجر</th>
                      <th className="pb-3 px-3 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stores
                      .filter(
                        (s) =>
                          s.name.includes(searchTerm) ||
                          (s.city && s.city.includes(searchTerm)) ||
                          (s.category && s.category.includes(searchTerm))
                      )
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={st.image || st.avatar || '/logo.jpg'}
                                alt={st.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                              />
                              <div>
                                <h4 className="font-bold text-[#07132B]">{st.name}</h4>
                                <span className="text-[10px] text-slate-400">{st.productsCount || 0} منتج معروض</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-medium text-slate-600">{st.city}</td>
                          <td className="py-3 px-3 text-slate-700">{st.category}</td>
                          <td className="py-3 px-3 font-bold text-amber-500">⭐ {st.rating || 5.0}</td>

                          <td className="py-3 px-3">
                            {st.verified ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                                شارة التوثيق الزرقاء 🛡️
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                غير موثق
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                st.status === 'suspended'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {st.status === 'suspended' ? 'موقوف ⛔' : 'نشط 🟢'}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => toggleStoreVerification(st.id)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  st.verified
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                {st.verified ? 'إلغاء التوثيق' : 'توثيق المتجر ✨'}
                              </button>
                              <button
                                onClick={() => adminToggleStoreStatus(st.id)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                                  st.status === 'suspended'
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                                }`}
                              >
                                {st.status === 'suspended' ? 'تفعيل' : 'إيقاف'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 6. PRODUCTS MODERATION (إدارة ومراقبة المنتجات) */}
          {/* ======================================================== */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    <span>مراقبة وإدارة كافة منتجات السوق ({products.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    مراقبة المنتجات المخالفة، إخفاء المنتجات، تفعيل النشر أو الحذف الفوري
                  </p>
                </div>

                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 outline-none focus:border-sky-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="pb-3 px-3">المنتج</th>
                      <th className="pb-3 px-3">المتجر التابع له</th>
                      <th className="pb-3 px-3">السعر</th>
                      <th className="pb-3 px-3">المخزون</th>
                      <th className="pb-3 px-3">حالة النشر والظهور</th>
                      <th className="pb-3 px-3 text-center">الإجراءات والرقابة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter(
                        (p) =>
                          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.storeName?.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={prod.image || '/logo.jpg'}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-[#07132B]">{prod.name}</h4>
                                <span className="text-[10px] text-slate-400">{prod.category}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-bold">{prod.storeName || 'متجر غيم'}</td>

                          <td className="py-3 px-3 font-mono font-bold text-[#07132B]">
                            {Number(prod.price).toLocaleString()} ر.ي
                          </td>

                          <td className="py-3 px-3 font-mono">{prod.inStock || 0} قطعة</td>

                          <td className="py-3 px-3">
                            <button
                              onClick={() => adminToggleProductVisibility(prod.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                                prod.isVisible !== false
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {prod.isVisible !== false ? 'معروض للبيع 🟢' : 'مخفي ⚪'}
                            </button>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  if (confirm(`تأكيد: هل ترغب في حذف المنتج المخالف "${prod.name}" نهائياً؟`)) {
                                    adminDeleteProduct(prod.id);
                                    alert('تم حذف المنتج بنجاح');
                                  }
                                }}
                                className="px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition border border-red-200 cursor-pointer"
                              >
                                حذف مخالف ❌
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 7. ORDERS LIFECYCLE (إدارة الطلبات المباشرة) */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    <span>متابعة كافة طلبات السوق ({orders.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    التحقق من بيانات العميل، المتجر، المندوب المكلف، وتحديث مسار الشحنة
                  </p>
                </div>

                {/* Filter Selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="all">كافة الطلبات</option>
                    <option value="pending">قيد المراجعة ⏳</option>
                    <option value="ready_for_pickup">جاهز للاستلام 📦</option>
                    <option value="on_the_way">مع المندوب 🛵</option>
                    <option value="delivered">تم التسليم ✅</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {orders
                  .filter((o) => (orderFilter === 'all' ? true : o.status === orderFilter))
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-[#F4F7FC]/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-sm text-[#07132B] bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                            {ord.id}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                            {ord.statusLabel || ord.status}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">{ord.date} {ord.time}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 pt-1">
                          <div>
                            <span className="text-slate-400 block text-[10px]">العميل:</span>
                            <span className="font-bold">{ord.customerName}</span>
                            <span className="font-mono text-[11px] text-slate-500 block" dir="ltr">{ord.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">المتجر التابع:</span>
                            <span className="font-bold text-sky-800">{ord.storeName}</span>
                            <span className="text-[11px] text-slate-500 block">{ord.address}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">المندوب المكلف:</span>
                            <span className="font-bold text-purple-800">{ord.courierName || 'لم يُحدد بعد'}</span>
                            <span className="text-[10px] text-slate-500 block">الدفع: {ord.paymentMethod || 'عند الاستلام'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls and Price */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                        <div className="text-left font-mono font-black text-sm text-[#07132B]">
                          {ord.total?.toLocaleString()} ر.ي
                        </div>

                        <select
                          value={ord.status}
                          onChange={(e) => adminUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                        >
                          <option value="pending">قيد المراجعة ⏳</option>
                          <option value="ready_for_pickup">جاهز للاستلام 📦</option>
                          <option value="on_the_way">مع المندوب 🛵</option>
                          <option value="delivered">تم التسليم بنجاح ✅</option>
                        </select>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 8. ROLES & PERMISSIONS MATRIX (إدارة الصلاحيات والأمان) */}
          {/* ======================================================== */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              {/* Security Shield Banner */}
              <div className="bg-gradient-to-r from-[#07132B] via-[#0d224d] to-[#07132B] text-white rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black">منظومة حماية الصلاحيات المشددة (Security & RBAC Enforcement)</h3>
                    <p className="text-xs text-sky-200">
                      محمي بواسطة PostgreSQL Triggers وRow Level Security (RLS) لمنع الترقية الذاتية للرتب (Self-Role Elevation)
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed">
                  🛡️ <strong>قاعدة الأمان الصارمة:</strong> لا يمكن لأي عميل أو تاجر أو مندوب ترقية حسابه إلى مشرف (admin) من الواجهة،
                  وكل طلب تعديل على عمود <code className="text-emerald-300 bg-black/40 px-1 py-0.5 rounded">role</code> يتم حظره وإلغاؤه فورياً على مستوى قاعدة البيانات ما لم يصدر من المشرف العام.
                </div>
              </div>

              {/* Roles Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Role 1: مدير */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-purple-900">مدير النظام (Admin)</span>
                    <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">👑</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    صلاحيات مطلقة: اعتماد المتاجر، إصدار أكواد الدعوة للمناديب، التحكم بالعمولات، وتعديل إعدادات المنصة.
                  </p>
                  <span className="text-[10px] text-purple-700 font-bold block pt-1">تسجيل دخول محمي بحسابات مسبقة</span>
                </div>

                {/* Role 2: تاجر */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-amber-900">تاجر شريك (Merchant)</span>
                    <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">🏪</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    إدارة المتجر والمنتجات، استقبال طلبات الزبائن، وسحب الأرباح عبر البنوك اليمنية.
                  </p>
                  <span className="text-[10px] text-amber-700 font-bold block pt-1">يتطلب موافقة واعتماد الإدارة مسبقاً</span>
                </div>

                {/* Role 3: مندوب */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-sky-900">مندوب توصيل (Courier)</span>
                    <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">🛵</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    استلام الشحنات من المتاجر، التوصيل في أحياء المكلا، وتأكيد التسليم برمز الأمان للعميل.
                  </p>
                  <span className="text-[10px] text-sky-700 font-bold block pt-1">يتطلب كود دعوة فريد (Invite Code)</span>
                </div>

                {/* Role 4: عميل */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-emerald-900">عميل متسوق (Customer)</span>
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">🛍️</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    تصفح آلاف المنتجات التراثية والحرفية، الطلب الفوري، تقييم المتاجر وإدارة العناوين.
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold block pt-1">تسجيل حر ومباشر وفوري</span>
                </div>
              </div>

              {/* Capability Matrix Table */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-black text-[#07132B]">مصفوفة الصلاحيات التفصيلية (Permission Matrix)</h4>
                  <p className="text-xs text-slate-500">توزيع العمليات المسموح بها لكل دور في غيم سبيس</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="pb-3 px-3">العملية / الصلاحية</th>
                        <th className="pb-3 px-3 text-center">العميل</th>
                        <th className="pb-3 px-3 text-center">التاجر</th>
                        <th className="pb-3 px-3 text-center">المندوب</th>
                        <th className="pb-3 px-3 text-center">المشرف العام</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-3 font-bold">تصفح المنتجات والشراء وإتمام الطلبات</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">إضافة منتجات وتعديل الأسعار والمخزون</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ لمتجره فقط</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ لكافة المتاجر</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">قبول شحنات التوصيل وتأكيد التسليم</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ إشراف وتعيين</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">الموافقة على فتح متجر جديد وتوثيقه</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم (حصري)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">توليد أكواد دعوات المناديب وإلغائها</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم (حصري)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold">تعديل نسبة العمولة والحسابات البنكية للمنصة</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-slate-300">❌ لا</td>
                        <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">✅ نعم (حصري)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit Logs List */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-[#07132B]">سجل التدقيق الأمني والعمليات (Audit Logs)</h4>
                    <p className="text-xs text-slate-500">توثيق شفاف لكافة الإجراءات الإدارية وتغييرات الحالة في المنصة</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                    {auditLogs.length} عملية مسجلة
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl border border-slate-100 bg-[#F4F7FC]/70 flex items-start justify-between text-xs gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#07132B]">{log.actor}</span>
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                            {log.role}
                          </span>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-1">{log.details}</p>
                      </div>
                      <span className="text-[10px] font-mono text-sky-600 font-black shrink-0">
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SUBSCRIPTIONS, FINANCES & YEMENI BANKING (الاشتراكات) */}
          {/* ======================================================== */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {/* Sub-tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSubFinanceTab('receipts')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      subFinanceTab === 'receipts'
                        ? 'bg-[#07132B] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>إيصالات التحويل البنكي</span>
                    {pendingPayments.length > 0 && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                        {pendingPayments.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setSubFinanceTab('invoices')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      subFinanceTab === 'invoices'
                        ? 'bg-[#07132B] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>فواتير الاشتراكات ({invoices.length})</span>
                  </button>

                  <button
                    onClick={() => setSubFinanceTab('banks')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      subFinanceTab === 'banks'
                        ? 'bg-[#07132B] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>حسابات البنوك اليمنية ({platformBankAccounts.length})</span>
                  </button>
                </div>
              </div>

              {/* Receipts Review */}
              {subFinanceTab === 'receipts' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-[#07132B]">إيصالات التحويل البنكي بانتظار المراجعة والاعتماد</h4>
                    <p className="text-xs text-slate-500">لا يتم تمديد الاشتراك إلا بعد مطابقة إيصال التاجر مع إيداعات الحساب</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-bold">
                          <th className="pb-3 px-3">المتجر والمرسل</th>
                          <th className="pb-3 px-3">البنك ورقم السند</th>
                          <th className="pb-3 px-3">المبلغ</th>
                          <th className="pb-3 px-3">تاريخ التحويل</th>
                          <th className="pb-3 px-3">الحالة</th>
                          <th className="pb-3 px-3 text-center">الإجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3">
                              <h5 className="font-bold text-[#07132B]">{p.storeName}</h5>
                              <span className="text-[10px] text-slate-400">المرسل: {p.senderName}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-slate-800 block">{p.bankName}</span>
                              <span className="font-mono text-[10px] text-slate-500">{p.transferRef}</span>
                            </td>
                            <td className="py-3 px-3 font-mono font-black text-slate-800">
                              {p.amount?.toLocaleString()} {p.currency || 'ر.ي'}
                            </td>
                            <td className="py-3 px-3 text-slate-600 text-[11px]">{p.transferDate}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  p.status === 'approved'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : p.status === 'rejected'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                                }`}
                              >
                                {p.status === 'approved'
                                  ? 'معتمد ومؤكد ✅'
                                  : p.status === 'rejected'
                                  ? 'مرفوض ❌'
                                  : 'بانتظار التدقيق ⏳'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {p.status === 'pending_verification' ? (
                                <button
                                  onClick={() => setSelectedPaymentForReview(p)}
                                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                                >
                                  معاينة الإيصال والاعتماد
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400">تمت المراجعة</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Invoices */}
              {subFinanceTab === 'invoices' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#07132B]">فواتير اشتراكات المتاجر ({invoices.length})</h4>
                      <p className="text-xs text-slate-500">الفواتير المستحقة والمدفوعة للاشتراكات الشهرية</p>
                    </div>
                    <button
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#07132B] hover:bg-[#122347] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-sky-400" />
                      <span>إصدار فاتورة جديدة</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-500 font-bold">
                          <th className="pb-3 px-3">رقم الفاتورة</th>
                          <th className="pb-3 px-3">المتجر</th>
                          <th className="pb-3 px-3">الباقة</th>
                          <th className="pb-3 px-3">المبلغ</th>
                          <th className="pb-3 px-3">تاريخ الاستحقاق</th>
                          <th className="pb-3 px-3">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50 transition">
                            <td className="py-3 px-3 font-mono font-bold text-sky-800">{inv.invoiceNumber}</td>
                            <td className="py-3 px-3 font-bold text-[#07132B]">{inv.storeName}</td>
                            <td className="py-3 px-3 text-slate-600">{inv.planName}</td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-800">
                              {inv.amount?.toLocaleString()} {inv.currency || 'ر.ي'}
                            </td>
                            <td className="py-3 px-3 text-slate-500">{inv.dueDate}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  inv.status === 'paid'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {inv.status === 'paid' ? 'مدفوعة ✅' : 'مستحقة السداد ⏳'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Yemeni Banks */}
              {subFinanceTab === 'banks' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-[#07132B]">حسابات البنوك اليمنية المعتمدة للمنصة</h4>
                    <p className="text-xs text-slate-500">الحسابات التي يستقبل عليها المشرف مبالغ اشتراكات المتاجر</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {platformBankAccounts.map((b) => (
                      <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-[#F4F7FC]/70 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#07132B]">{b.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            معتمد رسمياً
                          </span>
                        </div>
                        <div className="space-y-1 text-slate-700">
                          <p><strong>اسم الحساب:</strong> {b.accountName}</p>
                          <p><strong>رقم الحساب:</strong> <span className="font-mono font-bold text-sky-800">{b.accountNumber}</span></p>
                          <p><strong>الفرع:</strong> {b.branch || 'المكلا'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORIES MANAGEMENT (التصنيفات) */}
          {/* ======================================================== */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#07132B] flex items-center gap-2">
                    <Tag className="w-5 h-5 text-sky-600" />
                    <span>إدارة تصنيفات المنصة ({categories.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    إضافة تصنيفات جديدة، تعديل المسميات، وإدارتها في الصفحة الرئيسية
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#07132B] hover:bg-[#122347] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-sky-400" />
                  <span>إضافة تصنيف جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 bg-[#F4F7FC]/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#07132B]">{cat.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                        {cat.count || '0 متجر'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{cat.description || 'تصنيف منتجات وخدمات حرفية'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* DATABASE CONTROL & SUPABASE (وضع الإنتاج) */}
          {/* ======================================================== */}
          {activeTab === 'database-control' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#07132B] via-[#0d224d] to-[#07132B] text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black">وضع الإنتاج الحقيقي (Clean Production Mode)</h3>
                      <p className="text-xs text-sky-200">
                        التحكم التام بين وضع العرض التجريبي وتفريغ المنصة للعمل الحقيقي
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    isProductionMode ? 'bg-emerald-400 text-slate-950' : 'bg-amber-400 text-slate-950'
                  }`}>
                    {isProductionMode ? 'وضع الإنتاج الحقيقي (Clean Mode) 🟢' : 'وضع البيانات النموذجية (Demo Mode) 🟡'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <h5 className="font-black text-emerald-900 text-sm">تفريغ المنصة للإنتاج الحقيقي (Clean Mode)</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      يفرغ البيانات الوهمية ويبدأ المنصة بـ 0 متاجر و0 منتجات حقيقية، مع الحفاظ على حساب الإدارة والحسابات البنكية.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('تأكيد: هل ترغب في تفريغ البيانات النموذجية وبدء الإنتاج الفعلي بـ 0؟')) {
                        resetToCleanProductionMode();
                        alert('تم تفعيل وضع الإنتاج الحقيقي بنجاح!');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition cursor-pointer"
                  >
                    تفريغ المنصة للإنتاج الحقيقي (0 متاجر و0 منتجات)
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <h5 className="font-black text-amber-900 text-sm">استعادة البيانات النموذجية (Demo Data)</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      يعيد تحميل المتاجر والمنتجات الحضرمية النموذجية لمعاينة واختبار كافة الميزات والشاشات.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('هل ترغب في استعادة البيانات النموذجية؟')) {
                        restoreDemoData();
                        alert('تمت استعادة البيانات بنجاح!');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    استعادة البيانات النموذجية
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ================= MODALS ================= */}
      {/* Receipt Review Modal */}
      <AdminReceiptReviewModal
        isOpen={Boolean(selectedPaymentForReview)}
        payment={selectedPaymentForReview}
        onClose={() => setSelectedPaymentForReview(null)}
        onApprove={(id) => {
          adminApprovePayment(id);
          setSelectedPaymentForReview(null);
          alert('تم اعتماد وقبول السداد بنجاح وتمديد اشتراك المتجر لـ 30 يوماً إضافية! ✅');
        }}
        onReject={(id, reason) => {
          adminRejectPayment(id, reason);
          setSelectedPaymentForReview(null);
          alert('تم رفض إثبات السداد وإشعار التاجر بسبب الرفض ❌');
        }}
      />

      {/* Create New Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={() => setIsInvoiceModalOpen(false)} />
          <div className="min-h-screen px-4 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 text-xs z-10">
              <h3 className="text-base font-black text-[#07132B] border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                <span>إصدار فاتورة اشتراك جديدة لمتجر</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const targetStore = stores.find((s) => s.id === newInvoiceForm.storeId) || stores[0];
                  adminCreateInvoice({
                    storeId: targetStore.id,
                    storeName: targetStore.name,
                    merchantName: targetStore.name,
                    planName: newInvoiceForm.planName,
                    amount: Number(newInvoiceForm.amount),
                    dueDate: newInvoiceForm.dueDate,
                    periodLabel: newInvoiceForm.periodLabel,
                    notes: newInvoiceForm.notes,
                  });
                  setIsInvoiceModalOpen(false);
                  alert('تم إصدار الفاتورة وإشعار التاجر بنجاح! 📄');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المتجر المستهدف</label>
                  <select
                    value={newInvoiceForm.storeId}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, storeId: e.target.value })}
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">وصف الفترة / الفاتورة</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.periodLabel}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, periodLabel: e.target.value })}
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المبلغ المطلوب (ر.ي)</label>
                    <input
                      type="number"
                      required
                      value={newInvoiceForm.amount}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: e.target.value })}
                      className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تاريخ الاستحقاق</label>
                    <input
                      type="date"
                      required
                      value={newInvoiceForm.dueDate}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })}
                      className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#07132B] text-white font-bold hover:bg-[#122347] transition shadow-md cursor-pointer"
                  >
                    إصدار الفاتورة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Courier Modal */}
      {isAddCourierModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={() => setIsAddCourierModalOpen(false)} />
          <div className="min-h-screen px-4 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 text-xs z-10">
              <h3 className="text-base font-black text-[#07132B] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                <span>إضافة مندوب توصيل جديد</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  adminAddCourier(newCourierForm);
                  setIsAddCourierModalOpen(false);
                  setNewCourierForm({ name: '', phone: '', email: '', city: 'المكلا', vehicleType: 'دراجة نارية', plateNumber: '' });
                  alert('تمت إضافة المندوب بنجاح! 🛵');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المندوب *</label>
                  <input
                    type="text"
                    required
                    value={newCourierForm.name}
                    onChange={(e) => setNewCourierForm({ ...newCourierForm, name: e.target.value })}
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف اليمني *</label>
                  <input
                    type="text"
                    required
                    value={newCourierForm.phone}
                    onChange={(e) => setNewCourierForm({ ...newCourierForm, phone: e.target.value })}
                    placeholder="771234567"
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">نوع المركبة</label>
                    <select
                      value={newCourierForm.vehicleType}
                      onChange={(e) => setNewCourierForm({ ...newCourierForm, vehicleType: e.target.value })}
                      className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    >
                      <option value="دراجة نارية">دراجة نارية</option>
                      <option value="سكوتر">سكوتر</option>
                      <option value="سيارة نقل">سيارة نقل خفيف</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المدينة</label>
                    <input
                      type="text"
                      value={newCourierForm.city}
                      onChange={(e) => setNewCourierForm({ ...newCourierForm, city: e.target.value })}
                      className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCourierModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#07132B] text-white font-bold hover:bg-[#122347] transition shadow-md cursor-pointer"
                  >
                    إضافة المندوب
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={() => setIsAddCategoryModalOpen(false)} />
          <div className="min-h-screen px-4 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 text-xs z-10">
              <h3 className="text-base font-black text-[#07132B] border-b border-slate-100 pb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-sky-500" />
                <span>إضافة تصنيف منتجات جديد</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  adminAddCategory(newCategoryForm);
                  setIsAddCategoryModalOpen(false);
                  setNewCategoryForm({ name: '', description: '', icon: 'tag' });
                  alert('تمت إضافة التصنيف بنجاح! 🏷️');
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم التصنيف *</label>
                  <input
                    type="text"
                    required
                    value={newCategoryForm.name}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
                    placeholder="مثال: فضيات وعقيق يماني"
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الوصف</label>
                  <textarea
                    rows={2}
                    value={newCategoryForm.description}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                    className="w-full bg-[#F4F7FC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCategoryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#07132B] text-white font-bold hover:bg-[#122347] transition shadow-md cursor-pointer"
                  >
                    حفظ التصنيف
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
