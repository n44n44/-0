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

    // Categories
    categories = [],
    adminAddCategory,
    adminUpdateCategory,
    adminDeleteCategory,

    // Merchants
    merchantsList = [],
    adminApproveMerchant,
    adminRejectMerchant,
    adminAddMerchant,
    adminUpdateMerchant,
    adminToggleMerchantStatus,
    adminDeleteMerchant,

    // Couriers
    couriersList = [],
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
    adminUpdateCustomer,
    adminToggleCustomerStatus,
    adminDeleteCustomer,

    // Orders
    adminUpdateOrderStatus,
    adminAssignOrderCourier,

    // Clean Production Mode
    isProductionMode,
    getDemoDataSummary,
    resetToCleanProductionMode,
    restoreDemoData,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState('stores'); // 'stores' | 'subscriptions' | 'orders' | 'users' | 'logs' | 'commissions' | 'settings'
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

  // State for editing plans or banks
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({});
  const [editingBankId, setEditingBankId] = useState(null);
  const [bankForm, setBankForm] = useState({});

  const pendingPayments = (payments || []).filter(
    (p) => p.status === 'pending_verification'
  );

  // Pending Merchants
  const pendingMerchants = (merchantsList || []).filter(
    (m) => m.status === 'pending_approval'
  );
  const [rejectingMerchantId, setRejectingMerchantId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('لم يستوفِ الشروط المحددة');

  // Add Merchant Modal
  const [isAddMerchantModalOpen, setIsAddMerchantModalOpen] = useState(false);
  const [newMerchantForm, setNewMerchantForm] = useState({
    name: '',
    phone: '',
    email: '',
    storeName: '',
    category: 'صناعات يدوية',
    city: 'المكلا',
  });

  // Edit Merchant Modal
  const [editingMerchant, setEditingMerchant] = useState(null);

  // Add Courier Modal
  const [isAddCourierModalOpen, setIsAddCourierModalOpen] = useState(false);
  const [newCourierForm, setNewCourierForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'المكلا',
    vehicleType: 'دراجة نارية',
    plateNumber: '',
  });

  // Edit Courier Modal
  const [editingCourier, setEditingCourier] = useState(null);

  // Add Category Modal
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    icon: 'vase',
    description: '',
  });

  // Edit Category Modal
  const [editingCategory, setEditingCategory] = useState(null);

  // Edit Product Modal in Admin
  const [adminEditingProduct, setAdminEditingProduct] = useState(null);

  // Clean Production Mode Confirm Dialog
  const [showCleanModeConfirm, setShowCleanModeConfirm] = useState(false);
  const demoSummary = getDemoDataSummary ? getDemoDataSummary() : {};

  const [searchTerm, setSearchTerm] = useState('');
  const [commissionRate, setCommissionRate] = useState(5);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState(1200);

  const filteredStores = stores.filter(
    (s) =>
      s.name.includes(searchTerm) ||
      (s.city && s.city.includes(searchTerm)) ||
      (s.category && s.category.includes(searchTerm))
  );

  // Platform Metrics
  const totalMarketGmv = orders.reduce((acc, o) => acc + (o.total || 0), 0) + 1845000;
  const platformRevenue = Math.round(totalMarketGmv * (commissionRate / 100));

  return (
    <div className="min-h-screen bg-[#F3F6FB] flex flex-col md:flex-row text-[#172A46]" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#172A46] text-white flex flex-col justify-between shrink-0 shadow-2xl border-l border-[#233f66]">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-[#233f66] flex items-center justify-between">
            <GhaymLogo size="md" subtitle="Super Admin Panel" />
          </div>

          <div className="px-6 py-2.5 bg-[#0e1b2f] text-[11px] text-[#54B9F2] font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة المشرف العام للمنصة</span>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 text-xs font-bold">
            {/* 1. New Merchant Registration Requests */}
            <button
              onClick={() => setActiveTab('pending-merchants')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'pending-merchants'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'text-amber-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-amber-400" />
                <span>طلبات انضمام التجار</span>
              </div>
              {pendingMerchants.length > 0 && (
                <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                  {pendingMerchants.length} جديد
                </span>
              )}
            </button>

            {/* 2. Merchants Management */}
            <button
              onClick={() => setActiveTab('merchants')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'merchants'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>إدارة التجار ({merchantsList.length})</span>
              </div>
            </button>

            {/* 3. Couriers Management */}
            <button
              onClick={() => setActiveTab('couriers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'couriers'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span>إدارة المندوبين ({couriersList.length})</span>
              </div>
            </button>

            {/* 4. Categories Management */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'categories'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>إدارة التصنيفات ({categories.length})</span>
              </div>
            </button>

            {/* 5. Stores Management */}
            <button
              onClick={() => setActiveTab('stores')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'stores'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                <span>إدارة المتاجر ({stores.length})</span>
              </div>
            </button>

            {/* 6. Products Moderation */}
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'products'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>إدارة المنتجات ({products.length})</span>
              </div>
            </button>

            {/* 7. Subscriptions & Yemeni Banking Receipts */}
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'subscriptions'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>الاشتراكات والمدفوعات</span>
              </div>
              {pendingPayments.length > 0 && (
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black animate-pulse">
                  {pendingPayments.length} إيصال
                </span>
              )}
            </button>

            {/* 8. Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'orders'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>كافة الطلبات ({orders.length})</span>
            </button>

            {/* 9. Customers */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'customers'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>إدارة العملاء</span>
            </button>

            {/* 10. Audit Logs */}
            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'logs'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>سجل التدقيق ({auditLogs?.length || 0})</span>
            </button>

            {/* 11. Database & Clean Production Mode */}
            <button
              onClick={() => setActiveTab('database-control')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'database-control'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'text-emerald-400 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>وضع الإنتاج وقاعدة البيانات</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                isProductionMode ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-900 text-amber-200'
              }`}>
                {isProductionMode ? 'إنتاج حقيقي' : 'بيانات تجريبية'}
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition text-right ${
                activeTab === 'settings'
                  ? 'bg-[#54B9F2] text-[#172A46] shadow-md shadow-sky-500/25 font-black'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>إعدادات النظام</span>
            </button>
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
            onClick={() => alert('تم تسجيل خروج المشرف')}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div>
            <h1 className="text-base font-black text-[#172A46]">
              لوحة تحكم المشرف العام (Admin Management)
            </h1>
            <span className="text-xs text-slate-500">
              إدارة الأسواق، تدقيق المتاجر الموثقة، ومراقبة العمولات المالية
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>النظام متصل وبوابات الدفع نشطة 🇾🇪</span>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">إجمالي مبيعات المنصة (GMV)</span>
                <span className="text-lg font-black text-[#172A46] mt-1 block font-mono">
                  {totalMarketGmv.toLocaleString()} ر.ي
                </span>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% نمو شهري</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#54B9F2] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">إيرادات عمولة غيم سبيس</span>
                <span className="text-lg font-black text-[#172A46] mt-1 block font-mono">
                  {platformRevenue.toLocaleString()} ر.ي
                </span>
                <span className="text-[11px] text-slate-400 font-bold mt-1 block">
                  معدل العمولة الحالي: {commissionRate}%
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Percent className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">المتاجر والأسر المنتجة</span>
                <span className="text-lg font-black text-[#172A46] mt-1 block font-mono">
                  {stores.length} متجر
                </span>
                <span className="text-[11px] text-[#54B9F2] font-bold mt-1 block">
                  {stores.filter(s => s.verified).length} معتمد موثق
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-bold block">إجمالي الطلبات المنجزة</span>
                <span className="text-lg font-black text-[#172A46] mt-1 block font-mono">
                  {orders.length + 140} طلب
                </span>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                  منطقة المكلا وحضرموت
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          
          {/* TAB: PENDING MERCHANTS ONBOARDING REQUESTS */}
          {activeTab === 'pending-merchants' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-500" />
                    <span>طلبات انضمام المتاجر والتجار الجدد ({pendingMerchants.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    مراجعة طلبات التسجيل الأول، والتحقق من رقم الهاتف اليمني وبيانات المتجر، واعتماد الحساب أو رفضه
                  </p>
                </div>
              </div>

              {pendingMerchants.length === 0 ? (
                <div className="py-14 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-black text-[#172A46]">لا توجد طلبات انضمام جديدة بانتظار المراجعة</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    تمت مراجعة واعتماد جميع طلبات تسجيل التجار السابقة، ستظهر هنا الطلبات الجديدة فور تسجيلها.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="pb-3 px-3">المتجر وصاحبه</th>
                        <th className="pb-3 px-3">رقم الهاتف اليمني</th>
                        <th className="pb-3 px-3">التصنيف والمدينة</th>
                        <th className="pb-3 px-3">تاريخ الطلب</th>
                        <th className="pb-3 px-3 text-center">الإجراء والقرار</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingMerchants.map((merchant) => (
                        <tr key={merchant.id} className="hover:bg-amber-50/40 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                                🏪
                              </div>
                              <div>
                                <h4 className="font-bold text-[#172A46]">{merchant.storeName || 'متجر جديد'}</h4>
                                <p className="text-[10px] text-slate-500">المالك: {merchant.name}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                            +967 {merchant.phone}
                          </td>

                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-800 font-bold text-[10px]">
                              {merchant.category || 'صناعات يدوية'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {merchant.city} {merchant.neighborhood ? `- ${merchant.neighborhood}` : ''}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-slate-500 text-[11px]">
                            {merchant.createdAt ? new Date(merchant.createdAt).toLocaleDateString('ar-YE') : 'اليوم'}
                          </td>

                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  adminApproveMerchant(merchant.id);
                                  alert(`تم اعتماد متجر "${merchant.storeName}" بنجاح! أصبح بإمكان التاجر البيع الآن. ✨`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-sm inline-flex items-center gap-1"
                              >
                                <span>موافقة واعتماد ✅</span>
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt('يرجى كتابة سبب رفض الطلب:', 'البيانات غير مكتملة أو النشاط غير متوافق');
                                  if (reason) {
                                    adminRejectMerchant(merchant.id, reason);
                                    alert('تم تسجيل رفض الطلب وإشعار صاحب المتجر.');
                                  }
                                }}
                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition border border-red-200"
                              >
                                <span>رفض ❌</span>
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

          {/* TAB: MERCHANTS FULL CRUD MANAGEMENT */}
          {activeTab === 'merchants' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#54B9F2]" />
                    <span>إدارة التجار والحسابات ({merchantsList.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    إضافة تاجر جديد يدوياً، تعديل بيانات الحساب والمتجر، تعطيل أو حذف الحسابات
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddMerchantModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#54B9F2]" />
                    <span>+ إضافة تاجر جديد</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="pb-3 px-3">التاجر والمتجر</th>
                      <th className="pb-3 px-3">رقم الهاتف (9 أرقام)</th>
                      <th className="pb-3 px-3">المدينة</th>
                      <th className="pb-3 px-3">حالة الحساب</th>
                      <th className="pb-3 px-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {merchantsList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 font-bold flex items-center justify-center shrink-0">
                              👤
                            </div>
                            <div>
                              <h4 className="font-bold text-[#172A46]">{m.name}</h4>
                              <p className="text-[10px] text-slate-400">{m.storeName || 'متجر غير مسمى'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                          +967 {m.phone}
                        </td>

                        <td className="py-3 px-3 text-slate-600">{m.city || 'المكلا'}</td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => adminToggleMerchantStatus(m.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                              m.status === 'suspended'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : m.status === 'pending_approval'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {m.status === 'suspended'
                              ? 'حساب معلق ⛔'
                              : m.status === 'pending_approval'
                              ? 'بانتظار الاعتماد ⏳'
                              : 'نشط معتمد ✅'}
                          </button>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingMerchant({ ...m })}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                              title="تعديل بيانات التاجر"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف التاجر "${m.name}" ومتجره؟`)) {
                                  adminDeleteMerchant(m.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                              title="حذف التاجر"
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
            </div>
          )}

          {/* TAB: COURIERS FULL CRUD MANAGEMENT */}
          {activeTab === 'couriers' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#54B9F2]" />
                    <span>إدارة مناديب التوصيل ({couriersList.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    إضافة مندوب جديد، تعديل المركبة ورقم اللوحة، مراقبة التقييم وحالة الاتصال
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCourierModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#54B9F2]" />
                  <span>+ إضافة مندوب جديد</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold">
                      <th className="pb-3 px-3">المندوب</th>
                      <th className="pb-3 px-3">رقم الهاتف (9 أرقام)</th>
                      <th className="pb-3 px-3">نوع المركبة واللوحة</th>
                      <th className="pb-3 px-3">المدينة والحي</th>
                      <th className="pb-3 px-3">حالة الحساب والاتصال</th>
                      <th className="pb-3 px-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {couriersList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                              🛵
                            </div>
                            <div>
                              <h4 className="font-bold text-[#172A46]">{c.name}</h4>
                              <p className="text-[10px] text-amber-500">⭐ {c.rating || 4.9} ({c.totalDeliveries || 0} تسليمة)</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-slate-700" dir="ltr">
                          +967 {c.phone}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800">{c.vehicleType || 'دراجة نارية'}</span>
                          <span className="text-[10px] text-slate-400 font-mono block">{c.plateNumber || 'لوحة حضرموت'}</span>
                        </td>

                        <td className="py-3 px-3 text-slate-600">
                          {c.city} - {c.neighborhood}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${c.isOnline !== false ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            <span className="text-[11px] font-bold text-slate-700">
                              {c.isOnline !== false ? 'متصل الآن' : 'غير متصل'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setEditingCourier({ ...c })}
                              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-sky-600 transition"
                              title="تعديل المندوب"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف المندوب "${c.name}"؟`)) {
                                  adminDeleteCourier(c.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                              title="حذف المندوب"
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
            </div>
          )}

          {/* TAB: CATEGORIES FULL CRUD MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#54B9F2]" />
                    <span>إدارة تصنيفات المنصة ({categories.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    إضافة تصنيفات جديدة للمنتجات، تعديل المسميات والوصف، وحذف التصنيفات غير النشطة
                  </p>
                </div>

                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-[#54B9F2]" />
                  <span>+ إضافة تصنيف جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-[#F3F6FB]/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#172A46]">{cat.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                          {cat.count || '0 متجر'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                        {cat.description || 'تصنيف منتجات وخدمات حرفية في المنصة'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {cat.id}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingCategory({ ...cat })}
                          className="p-1 rounded-lg text-slate-600 hover:bg-white hover:text-sky-600 transition"
                          title="تعديل التصنيف"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف تصنيف "${cat.name}"؟`)) {
                              adminDeleteCategory(cat.id);
                            }
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-white transition"
                          title="حذف التصنيف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS MODERATION IN ADMIN */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46] flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#54B9F2]" />
                    <span>مراقبة وإدارة كافة منتجات السوق ({products.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    التحكم في ظهور المنتجات، تعديل الأسعار والمخزون، وحذف المنتجات المخالفة
                  </p>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="py-14 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-black text-[#172A46]">لا توجد منتجات مسجلة في المنصة حالياً</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    المنصة في وضع نظيف خالٍ من المنتجات، ستظهر هنا المنتجات فور قيام التجار بإضافتها.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 font-bold">
                        <th className="pb-3 px-3">المنتج</th>
                        <th className="pb-3 px-3">المتجر التابع له</th>
                        <th className="pb-3 px-3">السعر</th>
                        <th className="pb-3 px-3">المخزون</th>
                        <th className="pb-3 px-3">حالة الظهور</th>
                        <th className="pb-3 px-3 text-center">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={prod.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&auto=format&fit=crop&q=80'}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-[#172A46]">{prod.name}</h4>
                                <span className="text-[10px] text-slate-400">{prod.category}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-700 font-bold">
                            {prod.storeName || 'متجر غيم'}
                          </td>

                          <td className="py-3 px-3 font-mono font-bold text-[#172A46]">
                            {prod.discountPrice ? (
                              <div>
                                <span className="text-[#54B9F2] block">{Number(prod.discountPrice).toLocaleString()} ر.ي</span>
                                <span className="text-[10px] text-slate-400 line-through block">{Number(prod.price).toLocaleString()} ر.ي</span>
                              </div>
                            ) : (
                              <span>{Number(prod.price).toLocaleString()} ر.ي</span>
                            )}
                          </td>

                          <td className="py-3 px-3 font-mono">
                            {prod.inStock || 0} قطعة
                          </td>

                          <td className="py-3 px-3">
                            <button
                              onClick={() => adminToggleProductVisibility(prod.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
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
                                onClick={() => setAdminEditingProduct({ ...prod })}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                                title="تعديل السعر والمخزون"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`هل أنت متأكد من حذف المنتج "${prod.name}"؟`)) {
                                    adminDeleteProduct(prod.id);
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

          {/* TAB: DATABASE CONTROL & CLEAN PRODUCTION MODE */}
          {activeTab === 'database-control' && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-[#172A46] via-[#1c3558] to-[#172A46] text-white rounded-3xl p-6 shadow-xl border border-[#233f66] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black">إدارة قاعدة البيانات ووضع الإنتاج الحقيقي (Clean Mode)</h3>
                      <p className="text-xs text-sky-200">
                        التحكم التام بين تشغيل المنصة بالبيانات التجريبية للعرض أو تفريغها لبدء الإنتاج الفعلي الحقيقي
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

              {/* Supabase Cloud Database Connection Card */}
              <div className="bg-gradient-to-l from-[#07132b] via-[#0d224d] to-[#07132b] text-white rounded-3xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">الربط السحابي بقاعدة بيانات Supabase (PostgreSQL)</h4>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          isSupabaseConnected ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 text-slate-950'
                        }`}>
                          {isSupabaseConnected ? 'متصل ومفعل 🟢' : 'وضع محلي (أوفلاين) ⚪'}
                        </span>
                      </div>
                      <p className="text-xs text-sky-200 mt-1">
                        يمكنك ربط المنصة مباشرة بسوبابيز، رفع ومزامنة المنتجات، المتاجر، والطلبات سحابياً في الوقت الفعلي.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenSupabaseModal && onOpenSupabaseModal()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Database className="w-4 h-4" />
                    <span>{isSupabaseConnected ? 'إدارة إعدادات سوبابيز' : 'إعداد وربط سوبابيز الآن ⚡'}</span>
                  </button>
                </div>
              </div>

              {/* Status & Statistics Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-right space-y-1">
                  <span className="text-xs text-slate-500 font-bold">إجمالي المتاجر الحالية</span>
                  <span className="text-2xl font-black text-[#172A46] block font-mono">{stores.length} متجر</span>
                  <span className="text-[11px] text-slate-400">
                    {demoSummary.demoStoresCount || 0} منها متاجر نموذجية
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-right space-y-1">
                  <span className="text-xs text-slate-500 font-bold">إجمالي المنتجات الحالية</span>
                  <span className="text-2xl font-black text-[#172A46] block font-mono">{products.length} منتج</span>
                  <span className="text-[11px] text-slate-400">
                    {demoSummary.demoProductsCount || 0} منها منتجات نموذجية
                  </span>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-right space-y-1">
                  <span className="text-xs text-slate-500 font-bold">إجمالي الطلبات المسجلة</span>
                  <span className="text-2xl font-black text-[#172A46] block font-mono">{orders.length} طلب</span>
                  <span className="text-[11px] text-slate-400">
                    {demoSummary.demoOrdersCount || 0} منها طلبات تجريبية
                  </span>
                </div>
              </div>

              {/* Action Controls Box */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-black text-[#172A46]">خيارات التبديل والتفريغ الآمن</h4>
                  <p className="text-xs text-slate-500">
                    وفقاً لتعليماتك الصريحة: لا يتم حذف البيانات إلا بموافقتك، ويمكنك في أي لحظة الاستعادة بضغطة زر
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Clean Production Mode Switch */}
                  <div className="p-5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 space-y-3 flex flex-col justify-between">
                    <div>
                      <h5 className="font-black text-emerald-900 text-sm flex items-center gap-2">
                        <span>🚀 تفعيل وضع الإنتاج الحقيقي الفارغ (Clean Production)</span>
                      </h5>
                      <p className="text-xs text-emerald-800/80 mt-1 leading-relaxed">
                        يفرغ المتاجر التجريبية والمنتجات النموذجية ويبدأ المنصة بـ 0 متاجر و0 منتجات و0 طلبات، مع الحفاظ التام على حساب الإدارة، الحسابات البنكية اليمنية، وخطط الاشتراكات.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('تأكيد: هل ترغب في تفريغ المنصة والبدء بـ 0 منتجات ومتاجر للإنتاج الحقيقي؟ يمكنك استعادة البيانات التجريبية لاحقاً في أي وقت.')) {
                          resetToCleanProductionMode();
                          alert('تم تفعيل وضع الإنتاج الحقيقي بنجاح! المنصة الآن نظيفة وجاهزة لاستقبال أول تاجر حقيقي.');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition shadow-md"
                    >
                      تفريغ المنصة للإنتاج الحقيقي الآن (بدء بـ 0)
                    </button>
                  </div>

                  {/* Restore Demo Data Switch */}
                  <div className="p-5 rounded-2xl border-2 border-amber-200 bg-amber-50/40 space-y-3 flex flex-col justify-between">
                    <div>
                      <h5 className="font-black text-amber-900 text-sm flex items-center gap-2">
                        <span>🔄 استعادة البيانات النموذجية والتجريبية (Demo Data)</span>
                      </h5>
                      <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                        يعيد تحميل المتاجر الثمانية النموذجية بحضرموت، المنتجات الحرفية الثمانية، وعينات الطلبات لتجربة ومعاينة النظام كما في الصور المعتمدة.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('هل ترغب في استعادة البيانات النموذجية كاملة؟')) {
                          restoreDemoData();
                          alert('تمت استعادة البيانات النموذجية بنجاح!');
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-md"
                    >
                      استعادة البيانات النموذجية (Demo Mode)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: STORES MANAGEMENT */}
          {activeTab === 'stores' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-[#172A46]">إدارة وتوثيق متاجر المنصة ({stores.length})</h3>
                  <p className="text-xs text-slate-500">
                    منح أو إلغاء شارة "موثق معتمد" لضمان جودة الحرفيين والأسر المنتجة
                  </p>
                </div>

                <div className="w-full sm:w-64 relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث عن متجر..."
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#54B9F2]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2" />
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
                      <th className="pb-3 px-3 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStores.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={st.image}
                              alt={st.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <h4 className="font-bold text-[#172A46]">{st.name}</h4>
                              <p className="text-[10px] text-slate-400">{st.productsCount} منتج معروض</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-medium text-slate-600">
                          {st.city}
                        </td>

                        <td className="py-3 px-3 text-slate-700">
                          {st.category}
                        </td>

                        <td className="py-3 px-3 font-bold text-amber-500">
                          ⭐ {st.rating}
                        </td>

                        <td className="py-3 px-3">
                          {st.verified ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              موثق معتمد ✅
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                              قيد التدقيق
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => toggleStoreVerification(st.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              st.verified
                                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {st.verified ? 'إلغاء التوثيق' : 'توثيق المتجر ✅'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ALL ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#172A46]">كافة طلبات السوق النشطة بالمكلا</h3>
                  <p className="text-xs text-slate-500">مراقبة دورة حياة الطلبات بين المشتري والتاجر والمندوب</p>
                </div>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-[#F3F6FB]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-[#172A46]">{ord.id}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#54B9F2] font-bold border border-sky-200">
                          {ord.statusLabel || ord.status}
                        </span>
                      </div>
                      <div className="text-slate-600 mt-1 space-y-0.5">
                        <p><strong>المشتري:</strong> {ord.customerName} ({ord.phone})</p>
                        <p><strong>المتجر:</strong> {ord.storeName}</p>
                        <p><strong>العنوان:</strong> {ord.address}</p>
                      </div>
                    </div>

                    <div className="text-left font-mono font-black text-sm text-[#172A46]">
                      {ord.total?.toLocaleString()} ر.ي
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2.5: USERS & RBAC (إدارة المستخدمين والصلاحيات) */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#172A46]">المستخدمين والصلاحيات (Role-Based Access Control)</h3>
                <p className="text-xs text-slate-500">
                  قاعدة البيانات الموحدة تضبط صلاحيات كل مستخدم بحسب دوره: عميل، تاجر، مندوب توصيل، أو مشرف عام
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(db?.users || []).map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-[#F3F6FB]/70 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#172A46] text-white flex items-center justify-center font-bold">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#172A46]">{u.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{u.phone}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'merchant'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : u.role === 'courier'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {u.role === 'admin'
                          ? 'مشرف عام (Admin)'
                          : u.role === 'merchant'
                          ? 'تاجر مستقل (Merchant)'
                          : u.role === 'courier'
                          ? 'مندوب توصيل (Courier)'
                          : 'عميل متسوق (Customer)'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                      <p>
                        <strong>نطاق الصلاحيات:</strong>{' '}
                        {u.role === 'admin'
                          ? 'إشراف كامل على كافة المتاجر، الطلبات، والعمولات والتحكم بالنظام.'
                          : u.role === 'merchant'
                          ? 'إدارة منتجات المتجر، تجهيز وتحديث الطلبات، وتعديل الأسعار والمخزون.'
                          : u.role === 'courier'
                          ? 'استلام الطلبات الجاهزة، تأكيد التسليم للعملاء، وسحب أرباح التوصيل.'
                          : 'تصفح السوق، الشراء، الدفع الإلكتروني، وتتبع حالة الشحنات.'}
                      </p>
                      {u.storeName && (
                        <p><strong>المتجر المرتبط:</strong> {u.storeName}</p>
                      )}
                      {u.vehicle && (
                        <p><strong>وسيلة التوصيل:</strong> {u.vehicle} ({u.plateNumber})</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2.8: AUDIT LOGS (سجل العمليات والتدقيق الموحد) */}
          {activeTab === 'logs' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#172A46]">سجل العمليات المباشر (Audit Logs)</h3>
                  <p className="text-xs text-slate-500">
                    مراقبة حية لكافة الأنشطة: إنشاء الطلبات، تجهيزها، استلامها من المندوبين، وتسليمها للعملاء
                  </p>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  {auditLogs.length} حركة مسجلة
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-100 bg-[#F3F6FB]/80 flex items-start justify-between text-xs gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#172A46]">{log.actor}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-200 text-slate-700">
                          {log.role}
                        </span>
                        <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{log.details}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#54B9F2] font-black shrink-0">
                      {log.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2.9: SUBSCRIPTIONS & YEMENI BANKING FINANCES */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              {/* Top Sub-tabs Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSubFinanceTab('receipts')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      subFinanceTab === 'receipts'
                        ? 'bg-[#172A46] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>إيصالات التحويل البنكي للمراجعة</span>
                    {pendingPayments.length > 0 && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black">
                        {pendingPayments.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setSubFinanceTab('invoices')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      subFinanceTab === 'invoices'
                        ? 'bg-[#172A46] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>فواتير واشتراكات المتاجر ({invoices.length})</span>
                  </button>

                  <button
                    onClick={() => setSubFinanceTab('plans')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      subFinanceTab === 'plans'
                        ? 'bg-[#172A46] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-sky-400" />
                    <span>خطط وباقات الاشتراك ({subscriptionPlans.length})</span>
                  </button>

                  <button
                    onClick={() => setSubFinanceTab('banks')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      subFinanceTab === 'banks'
                        ? 'bg-[#172A46] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>الحسابات البنكية المعتمدة باليمن ({platformBankAccounts.length})</span>
                  </button>
                </div>

                {subFinanceTab === 'invoices' && (
                  <button
                    onClick={() => setIsInvoiceModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إصدار فاتورة جديدة للمتجر</span>
                  </button>
                )}
              </div>

              {/* SUB-TAB 1: RECEIPTS REVIEW */}
              {subFinanceTab === 'receipts' && (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 font-bold block">إيصالات بانتظار التدقيق والمطابقة</span>
                        <span className="text-2xl font-black text-amber-600 font-mono mt-1 block">
                          {pendingPayments.length}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">يتطلب مراجعة كشف الحساب البنكي</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 font-bold block">إجمالي التحويلات المعتمدة</span>
                        <span className="text-2xl font-black text-emerald-600 font-mono mt-1 block">
                          {payments.filter(p => p.status === 'approved').length}
                        </span>
                        <span className="text-[10px] text-emerald-600 block mt-0.5">تم تمديد اشتراكاتها بنجاح</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 font-bold block">إجمالي إيرادات الاشتراكات</span>
                        <span className="text-2xl font-black text-[#172A46] font-mono mt-1 block">
                          {payments.filter(p => p.status === 'approved').reduce((acc, p) => acc + p.amount, 0).toLocaleString()} ر.ي
                        </span>
                        <span className="text-[10px] text-sky-600 font-bold block mt-0.5">محصلة عبر البنوك اليمنية</span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Receipts Table */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-[#172A46]">كافة إيصالات التحويل البنكي المرفوعة من التجار</h4>
                        <p className="text-xs text-slate-500">
                          لا يعتبر الاشتراك مدفوعاً إلا بعد مطابقة المشرف للإيصال مع إيداعات الحساب البنكي
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {payments.length} عملية تحويل
                      </span>
                    </div>

                    {payments.length === 0 ? (
                      <p className="text-center py-8 text-xs text-slate-400">لا توجد إيصالات سداد مرفوعة حتى الآن</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="border-b border-slate-100 text-slate-400 font-bold">
                              <th className="pb-3 pr-2">رقم العملية</th>
                              <th className="pb-3">المتجر والتاجر</th>
                              <th className="pb-3">البنك المحول إليه</th>
                              <th className="pb-3">المبلغ</th>
                              <th className="pb-3">رقم الحوالة / الإشعار</th>
                              <th className="pb-3">تاريخ التحويل</th>
                              <th className="pb-3">الإيصال</th>
                              <th className="pb-3">الحالة</th>
                              <th className="pb-3 pl-2 text-center">إجراء الإدارة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {payments.map((pay) => (
                              <tr key={pay.id} className="hover:bg-slate-50/60 transition">
                                <td className="py-3.5 pr-2 font-mono font-bold text-[#172A46]">
                                  {pay.id}
                                </td>
                                <td className="py-3.5 font-bold text-[#172A46]">
                                  {pay.storeName || 'متجر مسجل'}
                                  <span className="text-[10px] text-slate-400 block font-normal">
                                    المرسل: {pay.senderName} ({pay.senderPhone})
                                  </span>
                                </td>
                                <td className="py-3.5 text-slate-700 font-bold">
                                  {pay.bankName}
                                </td>
                                <td className="py-3.5 font-mono font-black text-emerald-700 text-sm">
                                  {pay.amount?.toLocaleString()} ر.ي
                                </td>
                                <td className="py-3.5 font-mono text-sky-600 font-bold">
                                  {pay.transferRef}
                                </td>
                                <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                                  {pay.createdAt || pay.transferDate}
                                </td>
                                <td className="py-3.5">
                                  {pay.receiptImage ? (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedPaymentForReview(pay)}
                                      className="p-1 rounded-lg border border-slate-200 hover:border-sky-400 transition"
                                      title="معاينة الإيصال"
                                    >
                                      <img
                                        src={pay.receiptImage}
                                        alt="إيصال التحويل"
                                        className="w-10 h-10 rounded object-cover shadow-sm"
                                      />
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 text-[10px]">لا يوجد</span>
                                  )}
                                </td>
                                <td className="py-3.5">
                                  {pay.status === 'approved' && (
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                      معتمد ومقبول ✅
                                    </span>
                                  )}
                                  {pay.status === 'pending_verification' && (
                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold animate-pulse">
                                      قيد التدقيق ⏳
                                    </span>
                                  )}
                                  {pay.status === 'rejected' && (
                                    <div className="space-y-0.5">
                                      <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                                        مرفوض ❌
                                      </span>
                                      {pay.rejectionReason && (
                                        <p className="text-[10px] text-red-600 mt-1 max-w-xs truncate" title={pay.rejectionReason}>
                                          السبب: {pay.rejectionReason}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 pl-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedPaymentForReview(pay)}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#172A46] hover:bg-[#233f66] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1 mx-auto"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                                    <span>تدقيق ومعاينة</span>
                                  </button>
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

              {/* SUB-TAB 2: ALL MERCHANTS SUBSCRIPTIONS & INVOICES */}
              {subFinanceTab === 'invoices' && (
                <div className="space-y-6">
                  {/* Stores Subscriptions Status Table */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-[#172A46]">حالة اشتراكات المتاجر وفترة الشهر المجاني</h4>
                      <p className="text-xs text-slate-500">
                        متابعة انتهاء الفترة التجريبية المجانية (30 يوماً) وتجديدات الاشتراكات لجميع المتاجر
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold">
                            <th className="pb-3 pr-2">المتجر</th>
                            <th className="pb-3">المدينة والحي</th>
                            <th className="pb-3">الباقة الحالية</th>
                            <th className="pb-3">الرسوم الشهرية</th>
                            <th className="pb-3">حالة الاشتراك</th>
                            <th className="pb-3">تاريخ التجديد</th>
                            <th className="pb-3">المدة المتبقية</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {stores.map((s) => {
                            const sub = subscriptions.find(subItem => subItem.storeId === s.id) || {
                              planName: 'باقة البداية للأسر المنتجة',
                              price: 15000,
                              status: 'active_trial',
                              currentPeriodEnd: '2026-11-20',
                            };
                            const daysRemaining = calculateDaysRemaining(sub.currentPeriodEnd);
                            return (
                              <tr key={s.id} className="hover:bg-slate-50/60 transition">
                                <td className="py-3.5 pr-2 font-bold text-[#172A46]">
                                  {s.name}
                                  {s.verified && (
                                    <span className="text-[10px] text-emerald-600 font-bold mr-1">
                                      (موثق)
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 text-slate-600">
                                  {s.city || 'المكلا'}
                                </td>
                                <td className="py-3.5 font-bold text-slate-700">
                                  {sub.planName}
                                </td>
                                <td className="py-3.5 font-mono font-bold text-[#172A46]">
                                  {sub.price?.toLocaleString()} ر.ي
                                </td>
                                <td className="py-3.5">
                                  {sub.status === 'active_trial' && (
                                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                      شهر تجريبي مجاني ☁️
                                    </span>
                                  )}
                                  {sub.status === 'expiring_soon' && (
                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold animate-pulse">
                                      يوشك على الانتهاء ⚠️
                                    </span>
                                  )}
                                  {sub.status === 'active_paid' && (
                                    <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold">
                                      مشترك ومسدد ✅
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 font-mono text-slate-500">
                                  {sub.currentPeriodEnd}
                                </td>
                                <td className="py-3.5 font-bold text-sky-600">
                                  {daysRemaining > 0 ? `متبقي ${daysRemaining} يوم` : 'منتهي'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Invoices Table */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-[#172A46]">سجل الفواتير الصادرة للمتاجر</h4>
                        <p className="text-xs text-slate-500">إدارة ومتابعة فواتير الاشتراكات والمدفوعات</p>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {invoices.length} فواتير
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 font-bold">
                            <th className="pb-3 pr-2">رقم الفاتورة</th>
                            <th className="pb-3">المتجر</th>
                            <th className="pb-3">الوصف والفترة</th>
                            <th className="pb-3">المبلغ</th>
                            <th className="pb-3">تاريخ الاستحقاق</th>
                            <th className="pb-3">الحالة</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                              <td className="py-3.5 pr-2 font-mono font-bold text-[#172A46]">
                                {inv.invoiceNumber}
                              </td>
                              <td className="py-3.5 font-bold text-[#172A46]">
                                {inv.storeName}
                              </td>
                              <td className="py-3.5 text-slate-600">
                                {inv.periodLabel}
                              </td>
                              <td className="py-3.5 font-mono font-black text-[#172A46]">
                                {inv.amount?.toLocaleString()} ر.ي
                              </td>
                              <td className="py-3.5 font-mono text-slate-500">
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
                                    قيد المراجعة ⏳
                                  </span>
                                )}
                                {inv.status === 'pending_payment' && (
                                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                                    مستحقة السداد 🔴
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: SUBSCRIPTION PLANS CRUD */}
              {subFinanceTab === 'plans' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#172A46]">خطط وباقات الاشتراك الشهرية (قابلة للتعديل ديناميكياً)</h4>
                      <p className="text-xs text-slate-500">
                        تعديل أسعار الباقات بالريال اليمني ونسب العمولة والمميزات دون الحاجة لتعديل الكود البرمجي
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan) => {
                      const isEditing = editingPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          className="p-5 rounded-3xl border-2 border-slate-200 hover:border-sky-300 transition bg-[#F3F6FB]/50 space-y-4 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#172A46]">{plan.name}</span>
                              {plan.popular && (
                                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                                  الأكثر طلباً
                                </span>
                              )}
                            </div>

                            {/* Editable Price */}
                            {isEditing ? (
                              <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 block font-bold">السعر الشهري الجديد (ر.ي):</label>
                                <input
                                  type="number"
                                  value={planForm.price || plan.price}
                                  onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
                                  className="w-full bg-white border border-sky-400 rounded-xl px-3 py-1.5 font-mono font-bold text-sm"
                                />
                                <label className="text-[10px] text-slate-500 block font-bold">نسبة العمولة %:</label>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={planForm.commissionRate || plan.commissionRate}
                                  onChange={(e) => setPlanForm({ ...planForm, commissionRate: Number(e.target.value) })}
                                  className="w-full bg-white border border-sky-400 rounded-xl px-3 py-1.5 font-mono font-bold text-sm"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-black text-[#172A46] font-mono">
                                    {plan.price?.toLocaleString()}
                                  </span>
                                  <span className="text-xs font-bold text-sky-600">ر.ي / شهرياً</span>
                                </div>
                                <span className="text-[11px] text-emerald-600 font-bold block mt-0.5">
                                  عمولة مبيعات مخفضة: {plan.commissionRate}%
                                </span>
                              </div>
                            )}

                            {/* Features list */}
                            <ul className="space-y-1.5 text-slate-600 text-[11px] pt-2 border-t border-slate-200">
                              {(plan.features || []).map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex justify-end">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => {
                                  adminUpdateSubscriptionPlan(plan.id, planForm);
                                  setEditingPlanId(null);
                                  setPlanForm({});
                                  alert('تم حفظ التعديلات على الخطة بنجاح!');
                                }}
                                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>حفظ التعديلات</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPlanId(plan.id);
                                  setPlanForm({ price: plan.price, commissionRate: plan.commissionRate });
                                }}
                                className="w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-[#172A46] border border-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
                              >
                                <Edit className="w-3.5 h-3.5 text-sky-600" />
                                <span>تعديل السعر والعمولة</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: APPROVED YEMENI BANK ACCOUNTS CRUD */}
              {subFinanceTab === 'banks' && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-[#172A46]">الحسابات المصرفية اليمنية المعتمدة لاستقبال المدفوعات</h4>
                      <p className="text-xs text-slate-500">
                        تعديل وإضافة أرقام الحسابات والآيبان للبنوك المعتمدة (الكريمي، العمقي، القطيبي، بن دول)
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const name = prompt('أدخل اسم البنك أو شركة الصرافة الجديدة:');
                        if (name) {
                          const acc = prompt('أدخل رقم الحساب:');
                          adminAddBankAccount({
                            name,
                            accountName: 'منصة غيم سبيس',
                            accountNumber: acc || '000000',
                            branch: 'المكلا',
                            instructions: 'تحويل فوري لحساب المنصة مع تدوين رقم الفاتورة.',
                          });
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-[#172A46] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-sky-400" />
                      <span>إضافة حساب بنكي جديد</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {platformBankAccounts.map((bank) => {
                      const isEditing = editingBankId === bank.id;
                      return (
                        <div
                          key={bank.id}
                          className={`p-5 rounded-3xl border-2 transition ${
                            bank.isActive !== false
                              ? 'border-slate-200 bg-white'
                              : 'border-slate-200 bg-slate-50 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-sky-600" />
                              <h5 className="font-bold text-xs text-[#172A46]">{bank.name}</h5>
                            </div>

                            <button
                              type="button"
                              onClick={() => adminToggleBankAccount(bank.id)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                                bank.isActive !== false
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {bank.isActive !== false ? 'مفعل لاستقبال التحويلات ✅' : 'معطل مؤقتاً'}
                            </button>
                          </div>

                          <div className="pt-3 space-y-2 text-xs">
                            {isEditing ? (
                              <div className="space-y-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block font-bold">اسم صاحب الحساب:</label>
                                  <input
                                    type="text"
                                    value={bankForm.accountName || bank.accountName}
                                    onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                                    className="w-full bg-[#F3F6FB] border border-sky-400 rounded-xl px-3 py-1.5 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block font-bold">رقم الحساب:</label>
                                  <input
                                    type="text"
                                    value={bankForm.accountNumber || bank.accountNumber}
                                    onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                                    className="w-full bg-[#F3F6FB] border border-sky-400 rounded-xl px-3 py-1.5 font-mono font-bold text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block font-bold">التعليمات:</label>
                                  <textarea
                                    rows="2"
                                    value={bankForm.instructions || bank.instructions}
                                    onChange={(e) => setBankForm({ ...bankForm, instructions: e.target.value })}
                                    className="w-full bg-[#F3F6FB] border border-sky-400 rounded-xl px-3 py-1.5 text-[11px]"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">اسم صاحب الحساب:</span>
                                  <span className="font-bold text-[#172A46]">{bank.accountName}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-400">رقم الحساب:</span>
                                  <span className="font-mono font-black text-amber-600 text-sm">{bank.accountNumber}</span>
                                </div>
                                {bank.iban && (
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">الآيبان / المرجع:</span>
                                    <span className="font-mono text-slate-600 text-[11px]">{bank.iban}</span>
                                  </div>
                                )}
                                <p className="text-[11px] text-slate-500 pt-1 leading-relaxed bg-[#F3F6FB] p-2.5 rounded-xl border border-slate-100">
                                  {bank.instructions}
                                </p>
                              </>
                            )}
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex justify-end mt-2">
                            {isEditing ? (
                              <button
                                type="button"
                                onClick={() => {
                                  adminUpdateBankAccount(bank.id, bankForm);
                                  setEditingBankId(null);
                                  setBankForm({});
                                  alert('تم حفظ بيانات الحساب البنكي بنجاح!');
                                }}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>حفظ التعديل</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBankId(bank.id);
                                  setBankForm({
                                    accountName: bank.accountName,
                                    accountNumber: bank.accountNumber,
                                    instructions: bank.instructions,
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                              >
                                <Edit className="w-3.5 h-3.5 text-sky-600" />
                                <span>تعديل الحساب</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMISSIONS & FINANCIALS */}
          {activeTab === 'commissions' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#172A46]">إعدادات العمولات المالية والنسب</h3>
                <p className="text-xs text-slate-500">
                  تحديد نسبة اقتطاع منصة غيم سبيس لدعم البنية التحتية وتسويق المنتجات
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F3F6FB] border border-slate-200 max-w-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">نسبة عمولة المبيعات:</span>
                  <span className="text-lg font-black text-[#54B9F2] font-mono">{commissionRate}%</span>
                </div>

                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full accent-[#54B9F2] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>2% (أدنى نسبة)</span>
                  <span>5% (الموصى به)</span>
                  <span>12% (أقصى نسبة)</span>
                </div>

                <p className="text-xs text-slate-600 pt-2 border-t border-slate-200 leading-relaxed">
                  يتم اقتطاع نسبة ({commissionRate}%) تلقائياً من كل طلبية ناجحة، ويتم تحويل الباقي مباشرة إلى محفظة التاجر لسحبها عبر بنك الكريمي أو العمقي.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-[#172A46]">إعدادات النطاق والتوصيل بالمكلا</h3>
                <p className="text-xs text-slate-500">
                  تحديد رسوم التوصيل الأساسية ومعدل الكيلومتر لمندوبي الدراجات النارية
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs max-w-2xl">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رسوم التوصيل الأساسية (ر.ي)</label>
                  <input
                    type="number"
                    value={baseDeliveryFee}
                    onChange={(e) => setBaseDeliveryFee(Number(e.target.value))}
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحد الأدنى للدفع عند الاستلام (COD)</label>
                  <input
                    type="text"
                    disabled
                    value="20,000 ر.ي (مُقفل شرط أمان)"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-500 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  onClick={() => alert('تم حفظ إعدادات السوق بنجاح!')}
                  className="px-6 py-2.5 rounded-xl bg-[#172A46] text-white font-bold hover:bg-[#233f66] transition"
                >
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* ADMIN RECEIPT REVIEW MODAL */}
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

      {/* CREATE NEW INVOICE MODAL */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            onClick={() => setIsInvoiceModalOpen(false)}
          />
          <div className="min-h-screen px-4 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 text-xs z-10">
              <h3 className="text-base font-black text-[#172A46] border-b border-slate-100 pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                <span>إصدار فاتورة اشتراك جديدة لمتجر</span>
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const targetStore = stores.find(s => s.id === newInvoiceForm.storeId) || stores[0];
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
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  >
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
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
                    className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
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
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تاريخ الاستحقاق</label>
                    <input
                      type="date"
                      required
                      value={newInvoiceForm.dueDate}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, dueDate: e.target.value })}
                      className="w-full bg-[#F3F6FB] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsInvoiceModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#172A46] text-white font-bold hover:bg-[#233f66] transition shadow-md"
                  >
                    إصدار الفاتورة وتنبيه التاجر
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
